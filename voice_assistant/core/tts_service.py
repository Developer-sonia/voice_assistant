from gtts import gTTS

def synthesize_speech(text, output_file):
    try:
        tts = gTTS(text=text, lang="en")
        tts.save(output_file)
    except Exception as e:
        print(f"Error synthesizing speech: {e}")
