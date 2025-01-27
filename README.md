# MyMelody: An Online Melodic Intonation Therapy App
### NOTE: It takes a bit for Render to start the backend :/ So, please wait a bit! [Render's policy on free web services](https://render.com/docs/free#spinning-down-on-idle)

[Hiii!!!](https://youtu.be/opj-dYy8WL8)

## What is Melodic Intonation Therapy?

Melodic Intonation Therapy (MIT) is a therapeutic technique designed to help individuals with speech and language impairments, particularly those recovering from conditions like aphasia. This therapy leverages the melodic and rhythmic elements of speech to improve verbal communication by engaging the brain's musical and language-processing areas. 

The process typically involves three blocks:  
1. Introducing simple phrases with a melody.  
2. Encouraging the patient to hum or sing along.  
3. Gradually transitioning to natural speech without the melodic support.  

[MyMelody's version](https://youtu.be/lY08cXfHfKY)

The structured, repetitive nature of MIT has been shown to be highly effective in helping patients regain their speech abilities.

## Built for DALI 25W Application, API Challenge

[Github Repo](https://github.com/aslitavasli/MyMelody.git) and 
[Deployed Link!](http://mymelody-3sak.onrender.com)


[Overview](https://youtu.be/EoflLgZ2SbY)


## Running Locally:

### For the frontend:
```bash
cd client
npm run dev
```

### For the backend:
```bash
cd server
npm start
```

*Note: The server and the client are configured to support Render links, ports, and Axios requests. If you want to run it locally, change the port settings (i.e., http://localhost:8000)!*


## My Experience

My interest in speech therapy goes long back, starting with my sister. Growing up, I watched her navigate the challenges of a speech disorder, and it gave me a firsthand understanding of how important effective therapies can be. Helping her along the way sparked my curiosity, and I started learning more about different speech therapy techniques. That’s when I stumbled across Melodic Intonation Therapy (MIT) while reading about unique approaches to improving communication.

So, while I was brainstorming a DALI project idea, MIT immediately came to mind. I remembered how its creative use of melody and rhythm had fascinated me and thought it would be incredible to make this therapy more accessible to those who need it, especially those who suffer from life-altering conditions like aphasia. I started researching more about MIT, hoping to find existing tools or platforms that made it easy to use and then improve it. Unfortunately, beyond a handful of YouTube videos and some outdated, paid apps, there wasn’t much out there. That gap got me thinking: what if I could create something modern, easy to use, and available to everyone?

That’s how the idea for my project was born. I wanted to make an online tool that not only made MIT accessible to anyone, anywhere, but also added a personal touch by allowing users to create their own levels instead of sticking to pre-made templates. It would be really cool to improve this project more as it currently relies on Oxford Dictionary API and a pre-made JSON template that unfortunately doesn't cover names, plurals and different variations of words!

## Technicalities

Through this journey, all of the APIs used were brand new to me. I explored new technologies, including Amazon Web Services (AWS), specifically the S3 Bucket and Polly API, both of which are widely used and versatile tools. It was exciting to learn and implement these services, as they enhanced my technical skillset and broadened my understanding of cloud-based solutions. Additionally, deploying a web application for the first time using Render was an incredible milestone. This experience reinforced my confidence in building and sharing functional, scalable web applications with real-world impact.


## Challenges

The greatest challenge was how I was going to "make it work". The project wasn't something standardized (ie. like a log-in component): I had to make it my own. There was a lot of functionality (creating levels, materials for the levels, storing/accessing them, creating audio files, handling different pitches, creating an audiobank, dictionary etc.) I had to think it through, I spent 4 whole days planning how I was going to make it work. I am really glad I took this approach though, as the rest of the process went smooth. 

The most prominent issue I faced throughout the logic was audio pronounciation. Based on how English is a non-phonetic language (you cannot always understand how words are pronounced simply by looking at their spelling), this created a huge issue for audio creation. For example, take the word hello. You would break it into syllables by he-llo. Yet, if you enter the syllable "he" into 
a generative source, it isn't going to have the pronounciation you'd desire. 

This issue highly impacted my LLM choice. I chose Polly because it had ssml syntax, which allowed me to get around this issue by using the Oxford API to retreive IPA format and break it into syllables. Unfortunately, the Polly voices that support ssml phonetic pronounciations are very 'non-human' sounding, which lowered the efficiency of my application.


## Important Parts:

### Note: The process of storage is as follows:
- for each word: (audio pronounciations with different pitches (stored in AWS S3 audio bank), spellings, sentence pitch): all stored in a MongoDB dictionary (independent of 'level' creation: if a word is entered, it becomes created in the word dictionary even if it isn't saved in a level (so that a word is 'created' only once for faster performance)
- for a sentence: (info on each word is stored in a level schema) (if a level is created)
- for a category (category schema, with a list of references to each level that is stored in the category)

### Amazon S3 Bucket: 
Acts as an audio bank for each word that is entered. Each word folder has pronounciations of each syllables (both high and low versions).

This is how each syllable is put. Each syllable has low and high pitch versions, in case a user wants to edit pitches.

```audio/${word}/syllable_${syllableIndex}_${pitch}.mp3```

There also exists piano and hum audio files. The url link is globally accessible (for the frontend to easily play it). 

### MongoDB:

Acts as a dictionary.
There are category and level modals that store information about each 'category/level' user creates.
There also exists a dictionary for each word used (where syllable, pitch, and AmazonS3Bucket links are stored).
This allows faster creation of levels.


### Notation.jsx:

```Notation.jsx``` in the frontend is very versatile. It takes information like the pitches, syllables, and audio pronounciations to create an interface and play the hums/pronounciations and the piano.


### Amazon Polly:

Is responsible for pronounciation creation. Uses ```<ssml>``` syntax and can have pitch variations.


## APIs


### Oxford API

Retreive IPA spellings of words.


### AWS API

Generate audio files for pronounciations and create an online S3 bucket for storage/access.


### ChatGPT
Break IPA spellings into syllables.

