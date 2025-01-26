
<script src="https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs" type="module"></script>
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useNavigate } from 'react-router-dom';

const Introduction = () => {
    const navigate = useNavigate();
    return (
        <div>
            <div className="intro">
                <div className="left-side">
                    <h1>The first ever <span className='text-adj'></span> <br/> Melodic Intonation
                    Therapy platform.</h1>
                    
                    <button onClick={() => navigate('/menu')}>Start Practice</button>
                    <h2>Learn More ↓</h2>
                </div>   

                <div className="right-side">
                    <DotLottieReact height={1500} width={1500} className="animation" src="https://lottie.host/6d0c80e8-4000-49be-932a-417ccad656fc/U6jVphIKqS.lottie"
                    loop
                    autoplay
                    />
                </div>
        
            </div>

            <div className='why-mit'>
                <h1>Melodic Intonation Therapy is a speech therapy technique designed to help people with speech and language difficulties, particularly those who have trouble speaking due to brain injuries like strokes or conditions like aphasia. <br/></h1>
                <p><br/> The therapy works by combining melody, rhythm, and repetition to improve speech. It’s based on the idea that music and language are processed in different parts of the brain. When the language areas are damaged, the brain’s ability to process music can be used to "retrain" speech.</p>

                <div className="steps-container">

                    <div className="step-1">
                    <div className="step-number">01</div>
                    <div className="step-content">
                        <h2>Hum</h2>
                        <p>Begin with humming a simple melody. This step helps activate the musical areas of the brain and prepares the individual for vocalization.</p>
                    </div>
                    </div>

                    <div className="step-2">
                    <div className="step-number">02</div>
                    <div className="step-content">
                        <h2>Unison Tap</h2>
                        <p>Sing or speak in unison with the therapist while tapping a rhythm. This combines melody and rhythm to build a foundation for speech.</p>
                    </div>
                    </div>

                    <div className="step-3">
                    <div className="step-number">03</div>
                    <div className="step-content">
                        <h2>Fading</h2>
                        <p>Gradually reduce your vocal support, encouraging the patient to produce the words or phrases more independently.</p>
                    </div>
                    </div>

                    <div className="step-4">
                    <div className="step-number">04</div>
                    <div className="step-content">
                        <h2>Alone</h2>
                        <p>The individual practices speaking or singing the phrase independently, reinforcing their ability to use speech without assistance.</p>
                    </div>
                    </div>

                </div>

            </div>

      
                <div className='demo-left'>
                    <h1>View a Session of MIT</h1>
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/QzLqNQ4PYik?si=k0zthYjav2EI5Qnm" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </div>
                
                <div className='demo-right'>
                    <h1 color='black'>Why MyMelody?</h1>
                    <p>Custom levels!</p>
                    <p> Only Web-App!</p>
                    <p>Free!</p>
                </div>

          

            <div> <button className='get-started' onClick={() => navigate('/menu')}>Get Started!</button></div>



        
        </div>
        

        
      
    );
};

export default Introduction;

