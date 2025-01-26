const dotenv = require('dotenv').config()
const AWS = require('aws-sdk');
const axios = require('axios');
// const Groq = require('groq-sdk')
const OpenAI = require('openai')
const Word = require('../models/word');
const fs = require('fs')
const Category = require('../models/category')
const Level = require('../models/level')

const { PollyClient, SynthesizeSpeechCommand } = require('@aws-sdk/client-polly'); 
const { eventNames } = require('process');
const category = require('../models/category');


const isLoaded = false

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },});

const s3Bucket = process.env.AWS_S3_BUCKET_NAME; // Replace with your S3 bucket name


// //initializing groq API
// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});



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

    pronounciations = []
    spellings = []
    determiningPitches = ''

    //check if its valid
    const isValid = /^[a-zA-Z?.\s]+$/.test(sentence);
   
    if (!isValid) {
      return res.json({ error: 'Sentence contains invalid characters. Only alphabets, spaces, period and question marks are allowed.' });
  }

  try{
      // strip periods and question marks from the sentence & convert to lower case
      sentence = sentence.replace(/[?.]/g, '');
      sentence = sentence.toLowerCase()

      // split the sentence into words
      const words = sentence.split(' ')

      // iterate through each word

      for (const word of words) {
          currWord = await processword(word)
            if (currWord == false){
                attempt2 = await processword(word)
                if (!attempt2){
                  return res.json({error: 'Could not load the level, please make sure you have entered words that exist in the dictionary and try again.'})
                }
                currWord = attempt2;
            }
          for (i = 0; i< currWord.audioData.length; i++){
          pronounciations.push(currWord.audioData[i])
          }
          spellings.push(...currWord.originalSpelled.split(/(?=-)/))
          determiningPitches += (currWord.originalSpelled) + ' ';
          i++;
      }
      
 
      var pitches = []
      //determine the flow
      pitches = determineFlow(determiningPitches)
    //also in handleSentence, we have to determine a way of which is high which is low 
    //breakSentenceIntoSyllables
    //return each word and 0-1 indicating high & low
      if (pitches.length == 0){
        res.json({error: 'Could not load the level, please try again.'})
      }
      return res.json({pronounciations, spellings, pitches})
    } catch (error){
      res.json({error: 'Could not load the level, please try again.'})
    }
} 



//NOTE: add smth for processing 's

const processword = async (word) => {

  try{
    //retreive the word as a parameter
    // word = req.body
    // word = "children"
    //see if it exists within the word bank?

    const foundWord = await Word.findOne({ original: word });

    if (foundWord){
      console.log('found')
      console.log(foundWord)
      return foundWord

   
    }

    //if it doesnt exist

    //check if it is <=3 letters, then it will be monosyllable and no need to break down into syllables
      if (word.length <=3){
        WordEntry = await Word.create({
          original: word,
          originalSpelled: word,
          ipaOriginal: word,
          ipaSpelled: word,
          syllableNumber: 1,
          audioData: []
        });
        
        //Polly generates a low pitch version of the syllable (indicated by parameter 0)
        const pronounciationUrl = await generatePollyAudio(word, word, 0, 0, true)

        //Polly generates a high pitch version of the syllable (indicated by parameter 1)
        await generatePollyAudio(word, word, 0, 1, true)

        WordEntry.audioData.push(pronounciationUrl);  // Add audio link to the audioData array

        await WordEntry.save();

        console.log('Word Entry:')
        console.log(WordEntry)

        return WordEntry.audioData
      }

      //if the word is greater than 3 letters
      else{ 

        //json hasn't been loaded yet
          if (!isLoaded){
            console.log('I happen lmfao')
            try {

              var rawData = fs.readFileSync('./resources/word_to_ipa_with_syllables.json', 'utf-8');
              var wordData = JSON.parse(rawData);
              console.log('JSON file successfully loaded into memory.');
              isLoaded = true;
            } catch (error) {
                console.error('Error loading JSON file:', error.message);
            }
        }

          //METHOD 1: USE THE JSON FILE
        //retreive the word from the JSON file (credit: https://github.com/Madoshakalaka/English-IPA/blob/master/word_to_ipa_with_syllables.json )
        if (word in wordData){
          console.log('inWordData')
        console.log(wordData[word])
        var syllableNumber = wordData[word].length
        var ipaFormat = ''
        var original_spelled = ''
        var ipa_spelled = ''

        for ( let i = 0; i < syllableNumber; i++){
          //build original ipa format
          ipaFormat = ipaFormat + wordData[word][i][1]

          //if it isn't the last syllable, you need to add a hyphen
          if (i <syllableNumber-1){
            original_spelled = original_spelled+ (wordData[word][i][0]+'-')
            ipa_spelled = ipa_spelled + (wordData[word][i][1]+'-')
          }
          //the last syllable
          else {
            original_spelled = original_spelled + (wordData[word][i][0])
            ipa_spelled = ipa_spelled + (wordData[word][i][1])
          }
        }

        console.log('TEST')
        console.log(original_spelled)
        console.log(ipa_spelled)
        console.log(syllableNumber)
        console.log(ipaFormat)


          //create the entry of the word into the audio bank 
        WordEntry = await Word.create({
          original: word,
          ipaOriginal: ipaFormat,
          originalSpelled: original_spelled,
          ipaSpelled: ipa_spelled,
          syllableNumber: syllableNumber,
          audioData: []
        });

        syllables = ipa_spelled.split('-')

        console.log('this is the word entry ')
        console.log(WordEntry)
      }
      else {

        //METHOD 2:
        //retreive the word from Oxford Dictionary API (if the word doesn't exist in the created list)
        const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
        const response = await axios.get(url);
        console.log('response of oxford')
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
        const openAIResponse = await breakIntoSyllables(word, ipaFormat)
        console.log(openAIResponse)
        const spelledIpa = await JSON.parse(openAIResponse.choices[0]?.message?.content)

        //get an array list
        console.log('original ipa')
        console.log(ipaFormat)
        console.log(spelledIpa)
        console.log(spelledIpa.original_spelled)
        syllables = spelledIpa.hyphen_ipa.split('-')
        syllableNumber = syllables.length

        //create the entry of the word into the audio bank 
        WordEntry = await Word.create({
          original: word,
          ipaOriginal: ipaFormat,
          originalSpelled: spelledIpa.original_spelled,
          ipaSpelled: spelledIpa.hyphen_ipa,
          syllableNumber: syllableNumber,
          audioData: []
        });

      }

      //creating pronounciations for each syllable
      for (let i= 0; i< syllableNumber; i++){
        console.log(syllables[i])
        
          //Polly generates a low pitch version of the syllable (indicated by parameter 0)
          if (syllableNumber == 1){

            const pronounciationUrl = await generatePollyAudio(syllables[i], word, i, 0, true)

            //Polly generates a high pitch version of the syllable (indicated by parameter 1)
            await generatePollyAudio(syllables[i], word, i, 1, true)

            await WordEntry.audioData.push(pronounciationUrl);  // Add audio link to the audioData array
            await WordEntry.save();
          }

          else {
          const pronounciationUrl = await generatePollyAudio(syllables[i], word, i, 0, false)
          await generatePollyAudio(syllables[i], word, i, 1, false)
          await WordEntry.audioData.push(pronounciationUrl);  // Add audio link to the audioData array
          await WordEntry.save();
          }

          
        }
          
        }
      await WordEntry.save();


      return WordEntry

  } catch (error) {
    
    Word.deleteOne({word})
    console.log('error!')
    return false;
  }
  
}

/******** breakIntoSyllables **********/
/* This function takes a IPA formatted word and breaks the word into syllables based on pronounciation.
* It makes a call to the OpenAI API and returns the hyphenated version of the word.
*
*/
const breakIntoSyllables = async (word, ipa) => {

  return openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `I will provide you with two versions of a word. One will be the IPA format and the one will be original. Please break down both into syllables by hyphenating according to its phonetic pronunciation. Ensure that syllable boundaries are based on phonological rules of American English rather than spelling, following the guidelines of the International Phonetic Alphabet (IPA). The IPA transcription should remain unchanged, and syllables should only be marked using hyphens where natural syllable breaks occur. Return the result in the following JSON format: 

        {
          "hyphen_ipa": "The IPA transcription of the word with syllables hyphenated.",
          "original_spelled": "The normal spelling of the word with syllables hyphenated."
        }

        The IPA format should be the same as the original, and no changes to the original pronunciation should occur. Please verify syllable boundaries based on American English pronunciation, not spelling. Do not respond with anything other than the JSON object. The original word: ${word} IPA Spelling of the word: ${ipa}`
      }
    ],
    temperature: 1,
    max_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  });
};



/****** generatePollyAudio ********/
/* This function takes the IPA spelling of a syllable and generates IPA accurate  
* pronounciation of the syllable using Amazon AWS's PollyAPI. It saves the 
* audio files to an Amazon S3 Bucket, numbered by the index.
* Accessible by the URL: `audio/${word}/syllable_${syllableIndex}_${pitch}.mp3`
*/

const generatePollyAudio = async (ipa, word, syllableIndex, pitch, isMonosyllable) => {
  
  // a parameter of 1 indicates high pitch
  if (pitch == 1){
    var pitchLevel = "60%"
  }

  //a parameter of 0 indicates low pitch
  else {
    pitchLevel = "-10%"
  }

  if (isMonosyllable){

    //since monosyllable, Polly can accurately pronounce the whole word
    var ssmlText = `<speak> 
    <prosody pitch="${pitchLevel}"> ${word} </prosody>
    </speak>`

  }

  else{
    var ssmlText = `<speak> 
    <prosody pitch="${pitchLevel}">
    <phoneme alphabet="ipa" ph="${ipa}"></phoneme>
    </prosody>
    </speak>`;

  }

  const params = {
    Engine: 'standard',
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
      throw new Error('No audio stream returned from Polly.');
    }
    
  
    const audioKey = `audio/${word}/syllable_${syllableIndex}_${pitch}.mp3`;
    await s3.upload({
      Bucket: s3Bucket,
      Key: audioKey,
      Body: audioBuffer,
      ContentType: 'audio/mpeg',
      ACL: 'public-read',
    }).promise();

    console.log(`Audio uploaded to S3 at: ${audioKey}`);
    
    return `https://${s3Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/audio/${word}/syllable_${syllableIndex}_`;
   


  } catch (err) {
   
    throw new Error("Failed to generate speech audio");
  }
};

//determine a flow. 
const determineFlow = (spellings) => {
  pitches = []
  low = true
  monosyllable = true

  console.log('spellings: ', spellings)
  for (let i = (spellings.length)-1; i >= 0; i--){
      console.log(spellings[i])
    if (spellings[i] == '-' || spellings[i] == ' '){
      
      monosyllable = false
      if (low){
        pitches.unshift(0)
        low = false
        console.log('i happen')
      }
      
      else{
        pitches.unshift(1)
        low = true
        console.log('me too')
      }

    }

  }

  //account for the first part
  if (monosyllable){
    if (low){
      pitches.unshift(0)
      console.log('i happen 2')
    }

    else{
      pitches.unshift(1)
      console.log('i happen 3')
    }
  }
  
  return pitches
}


const getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate('levels')  // This will populate the levels field with the associated Level documents
      .exec();

    // const categoryNames = categories.map((category) => category.name); 
    // console.log('category names:', categoryNames)
    return res.status(200).json({ categories: categories });
    // res.status(200).json({ categories: categoryNames });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({ message: "Failed to fetch categories." });
  }
};



const getCategoryNames = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate('levels')  // This will populate the levels field with the associated Level documents
      .exec();

    const categoryNames = categories.map((category) => category.name); 
    console.log('category names:', categoryNames)
    // res.status(200).json({ categories: categories });
    return res.status(200).json({ categories: categoryNames });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({ message: "Failed to fetch categories." });
  }
};

const saveLevel = async (req, res)=> {

  const { selectedCategory, phrase, pronounciations, spellings, pitches } = req.body;

  console.log('piotches')
  console.log(pitches)
  const categoryName = selectedCategory.toLowerCase();
  const levelName = phrase.toLowerCase();

  //try to see if the category exists
  const currCategory = await Category.findOne({ name: categoryName });

  
  if (!currCategory){
    return res.json({error: "Failed to save the level, please try again."})
  }
  
  //does this level already exist?
  const exists = await Level.findOne({phrase: levelName})
  
  if (exists){
    const categoryUnder = await Category.findOne({ levels: exists }).populate('name')
    return res.json({error: `This level already exists under "${categoryUnder.name}", you can try editing the level.`})
  }

  //create the level
  newLevel = await Level.create({pronounciations: pronounciations, spellings: spellings, phrase: levelName, pitches: pitches})

  
  //add the level to the category
  currCategory.levels.push(newLevel)
  await currCategory.save()

  return res.json({message: "Level successsfully created!"})
}


const saveLevelAndCategory = async (req, res)=> {

  const { newCategory, phrase, pronounciations, spellings, pitches } = req.body;

  const categoryName = newCategory.toLowerCase();
  const levelName = phrase.toLowerCase();

  const currCategory = await Category.findOne({ name: categoryName});


  //if a category exists
  if (currCategory){

    //does this level already exist?
    const exists = await Level.findOne({phrase: levelName})
   
    if (exists){
      const categoryUnder = await Category.findOne({ levels: exists }).populate('name')
      return res.json({error: `This level already exists under "${categoryUnder.name}", you can try editing the level.`})
    }

    //create new level
    newLevel = await Level.create({pronounciations: pronounciations, spellings: spellings, phrase: levelName, pitches: pitches})

    if (newLevel){
    //add the level to the category
    currCategory.levels.push(newLevel)
   await currCategory.save()
    return res.json({message: "This category already exists and the level has been saved there!"})
    }

  }

  //if a category doesn't exist
  newlyCreatedCategory = await Category.create({name: categoryName, levels: []})


  //does this level already exist?
  const exists = await Level.findOne({phrase: levelName})

  if (exists){
    const categoryUnder = await Category.findOne({ levels: exists }).populate('name')
    return res.json({error: `This level already exists under "${categoryUnder.name}", you can try editing the level. Your new category has been created.`})
  }

  //create the level
  newLevel = await Level.create({pronounciations: pronounciations, spellings: spellings, phrase: levelName, pitches: pitches})

  newlyCreatedCategory.levels.push(newLevel)
  await newlyCreatedCategory.save()

  return res.json({message: 'Your level and category have been created!', category: newlyCreatedCategory})
}

const thisLevelExists = async (req, res) => {

  try {
    const { phrase } = req.query;
    console.log(phrase)
    console.log('phrase^')
    //does this level already exist?
    const exists = await Level.findOne({phrase: phrase})
  
   
    if (exists){
      const categoryUnder = await Category.findOne({ levels: exists }).populate('name')
     
      // console.log(res)
      return res.json({category: categoryUnder.name})
    }
 
    //category doesn't exist
    else {
    
      return (res.json({category: false}))
    }

  }
  catch (err){
    console.log('whopsoe')
    return (res.json({error: "An error occured."}))
  }
}

const changeLevelCategory = async (req, res) =>{

  const { phrase, finalCategory } = req.body;
  console.log('this is the phrase and category', phrase)
  console.log(finalCategory)
  const level = await Level.findOne({phrase: phrase})
  const oldCategory = await Category.findOne({ levels: level })
  const newCategory = await Category.findOne({ name: finalCategory })

  //add level to the new category
  //if the new category exists, simply add it
  if (newCategory){
    newCategory.levels.push(level)
    await newCategory.save();
  } 
  //if it doesnt, create and save
  else{
    newlyCreatedCategory = await Category.create({name: finalCategory, levels: []})
    await newlyCreatedCategory.levels.push(level)
    await newlyCreatedCategory.save();

    //RETURN NAME?
  }
    if (oldCategory){
    await oldCategory.populate('levels');

    // Filter based on the phrase
    oldCategory.levels = oldCategory.levels.filter(
      (aLevel) => aLevel.phrase !== level.phrase
    );
    
    await oldCategory.save();
    return res.json({message: "Success!"})
  }
}

const deleteCategory = async (req, res) => {
  try{
   
    const categoryToDelete  = req.body.delete;

    for (const levelId of categoryToDelete.levels) {
      await Level.findByIdAndDelete(levelId);
    }

    await Category.findByIdAndDelete(categoryToDelete._id)
    res.json({message: "Category deleted successfully!"})
  }
  catch(error){
    res.json({error: "Error deleting the category. Please try again."})
  }
  
}

const changeCategoryName = async (req, res) => {

  try{
  const { oldCategory, newName} = req.body;

  const categoryWithNewName = await Category.findById(oldCategory._id)
  categoryWithNewName.name = newName;
  await categoryWithNewName.save()

  // const updatedCategory = await Category.findByIdAndUpdate(oldCategory._id, {name: newName})
  } catch (error){
    res.json({error: "Error changing the category's name. Please try again."})
  }
   res.json({message: "Category updated successfully!"})
}

const deleteLevel = async (req,res) =>{
  const { phrase } = req.params; // Get the level ID from the request parameters

  const level = await Level.findOne({phrase: phrase}); // Find and delete the level by ID

  try {

    await Category.findOneAndUpdate(
      { levels: level._id }, // Find the category containing the level
      { $pull: { levels: level._id } } // Remove the `exists` value from the `levels` array
    );
    
    result = await Level.findByIdAndDelete(level._id);
    
    if (!result) {
      return res.json({ error: 'Level not found' }); // Return 404 if no level was found
    }
    res.json({ message: 'Level deleted successfully' }); // Return success response
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error}); // Return error response
  }
}
module.exports = {
    test, processword, handleSentence, saveLevel, getCategories, getCategoryNames, saveLevelAndCategory, thisLevelExists, changeLevelCategory, deleteCategory, changeCategoryName, deleteLevel}