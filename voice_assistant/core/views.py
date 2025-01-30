from django.shortcuts import render
from django.http import JsonResponse
from .stt_service import transcribe_audio
from .ai_service import get_ai_response
from .tts_service import synthesize_speech
import shutil

def voice_assistant(request):
    if request.method == "POST":
        try:
            # Save the uploaded audio file
            audio_file = request.FILES["audio"]
            with open("input.webm", "wb") as f:
                for chunk in audio_file.chunks():
                    f.write(chunk)

            # Step 1: Convert audio to text
            question_text = transcribe_audio("input.webm")
            if not question_text:
                return JsonResponse({"error": "Could not transcribe audio."}, status=400)

            # Step 2: Get AI-generated response
            ai_response = get_ai_response(question_text)

            # Step 3: Convert response to speech
            synthesize_speech(ai_response, "response.mp3")

            # Step 4: Move response.mp3 to static folder
            shutil.move("response.mp3", "core/static/response.mp3")

            # Step 5: Return the audio URL
            return JsonResponse({"audio_url": "/static/response.mp3"})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return render(request, 'index.html')

    
