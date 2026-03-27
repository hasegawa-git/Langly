import os
import uuid
import asyncio
import azure.cognitiveservices.speech as speechsdk
from dotenv import load_dotenv

load_dotenv()

AZURE_SPEECH_KEY = os.getenv("AZURE_SPEECH_KEY", "")
AZURE_SPEECH_REGION = os.getenv("AZURE_SPEECH_REGION", "")


async def text_to_speech(text: str) -> bytes:
    """
    テキストを音声に変換してバイト列で返す。
    Azure AI Speech の TTS を使用する。
    """
    speech_config = speechsdk.SpeechConfig(
        subscription=AZURE_SPEECH_KEY,
        region=AZURE_SPEECH_REGION,
    )
    speech_config.speech_synthesis_voice_name = "en-US-JennyNeural"

    # メモリ上で音声を生成する
    synthesizer = speechsdk.SpeechSynthesizer(
        speech_config=speech_config,
        audio_config=None,
    )

    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(
        None,
        lambda: synthesizer.speak_text_async(text).get(),
    )

    if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
        return result.audio_data
    else:
        cancellation = result.cancellation_details
        raise RuntimeError(f"音声生成に失敗しました: {cancellation.reason} / {cancellation.error_details}")
