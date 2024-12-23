const dotenv = require('dotenv').config()
const AWS = require('aws-sdk');
const axios = require('axios');
const Groq = require('groq-sdk')
const Word = require('../models/word');

const { PollyClient, SynthesizeSpeechCommand, Engine, SpeechMarkType } = require('@aws-sdk/client-polly'); 


const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },});

const s3Bucket = process.env.AWS_S3_BUCKET_NAME; // Replace with your S3 bucket name


//initializing groq API
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// // initializing Amazon Polly API
// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION
// });

const polly = new PollyClient({
  region: process.env.AWS_REGION,  // Ensure you have the correct region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }},);


const test = (req, res) => {
    res.json("test is working");
  };
  
const handleSentence = async (req, res) => {

    var sentence = req.query.sentence
    console.log('sentence: ')
    console.log(sentence)

    pronounciations = []
    //check if its valid
    const isValid = /^[a-zA-Z?.\s]+$/.test(sentence);
    console.log(isValid)
    if (!isValid) {
      return res.json({ error: 'Sentence contains invalid characters. Only alphabets, spaces, period and question marks are allowed.' });
  }
  
    // strip periods and question marks from the sentence
    sentence = sentence.replace(/[?.]/g, '');

    // split the sentence into words
    const words = sentence.split(' ')
    console.log(words)

    // iterate through each word
    i = 0
    for (const word of words) {
        pronounciations[i] = await processword(word)
        i++;
    }
    
    console.log(pronounciations)
    return res.json({pronounciations})
} 





//NOTE: add smth for processing 's

const processword = async (word) => {

  //retreive the word as a parameter
  // word = req.body
  // word = "children"
  //see if it exists within the word bank?

  const foundWord = await Word.findOne({ original: word });

  if (foundWord){
    console.log('exists')
    return foundWord.audioData
  }
  
  //if it doesnt exist

  //retreive the word from Oxford Dictionary API 
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  const response = await axios.get(url);
  console.log('response')
  console.log(response.data[0])
  //retreive the IPA format from the JSON response
  ipaFormat = response.data[0].phonetic

  //to account for some entries not having a .phonetic JSON response
  i=1
  while (!ipaFormat){
    ipaFormat = response.data[0].phonetics[i].text
    i++
  }
  //break the word into syllables using LLM
  const groqResponse = await breakIntoSyllables(ipaFormat)
  const spelledIpa = await JSON.parse(groqResponse.choices[0]?.message?.content)

  //get an array list
  console.log('original ipa')
  console.log(ipaFormat)
  console.log(spelledIpa)
  syllables = spelledIpa.hyphen_ipa.split('-')
  syllableNumber = syllables.length

  //create the entry of the word into the audio bank 
  WordEntry = await Word.create({
    original: word,
    ipaOriginal: ipaFormat,
    ipaSpelled: spelledIpa.hyphen_ipa,
    syllableNumber: syllableNumber,
    audioData: []
  });

    //creating pronounciations for each syllable
    for (let i= 0; i< syllableNumber; i++){
      console.log(syllables[i])
        const pronounciationUrl = await generatePollyAudio(syllables[i], word, i)
        WordEntry.audioData.push(pronounciationUrl);  // Add audio link to the audioData array
      }
     
    
    await WordEntry.save();
    return WordEntry.audioData

}

/******** breakIntoSyllables **********/
/* This function takes a IPA formatted word and breaks the word into syllables based on pronounciation.
* It makes a call to the GroqAPI and returns the hyphenated version of the word.
*
*/
const breakIntoSyllables = async (word) => {

  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Please break down the following word into syllables by hyphenating according to its phonetic pronunciation. Ensure that syllable boundaries are based on phonological rules rather than spelling, following the guidelines of the International Phonetic Alphabet (IPA). The IPA transcription should remain unchanged, and syllables should only be marked using hyphens where natural syllable breaks occur. Return the result in the following JSON format:

        hyphen_ipa: The IPA transcription of the word with syllables hyphenated.

        The IPA format should be the same as the original, and no changes to the original pronunciation should occur. Please verify syllable boundaries based on pronunciation, not spelling.: ${word}`,
      },

      {
        "role": "assistant",
        "content": "```json"
      }
    ],
    model: "llama3-8b-8192",
    "stop": "```"
  });

}

/****** generatePollyAudio ********/
/* This function takes the IPA spelling of a syllable and generates IPA accurate  
* pronounciation of the syllable using Amazon AWS's PollyAPI. It saves the 
* audio files to an Amazon S3 Bucket, numbered by the index.
* Accessible by the URL: `audio/${word}/syllable_${syllableIndex}.mp3`
*/

const generatePollyAudio = async (ipa, word, syllableIndex) => {
  
  const ssmlText = `<speak><phoneme alphabet="ipa" ph="${ipa}"></phoneme></speak>`;

  const params = {
    Engine: 'neural',
    LanguageCode: 'en-US',
    OutputFormat: 'mp3',
    SpeechMarkType: 'ssml',
    Text: ssmlText,
    TextType: "ssml" ,
    VoiceId:'Joanna', 
  };

  try {
    
    const command = new SynthesizeSpeechCommand(params);

    const data = await polly.send(command);
    const audioBuffer = data.AudioStream;
    if (!data.AudioStream) {
      throw new Error('No audio stream returned from Polly');
    }
    
    const audioKey = `audio/${word}/syllable_${syllableIndex}.mp3`;
    await s3.upload({
      Bucket: s3Bucket,
      Key: audioKey,
      Body: audioBuffer,
      ContentType: 'audio/mpeg',
      ACL: 'public-read',
    }).promise();

    console.log(`Audio uploaded to S3 at: ${audioKey}`);
    
    return `https://${s3Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${audioKey}`;
   


  } catch (err) {
    console.error("Error generating audio with Polly:");
    console.log(err)
    throw new Error("Failed to generate speech audio");
  }
};


module.exports = {
    test, processword, handleSentence}