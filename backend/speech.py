# ライブラリをインポート
import os
import asyncio
import azure.cognitiveservices.speech as speechsdk
from dotenv import load_dotenv

# .envファイルから環境変数を読み込む
load_dotenv()

# 環境変数からAzure SpeechのAPIキーとリージョンを取得
AZURE_SPEECH_KEY = os.getenv("AZURE_SPEECH_KEY", "")
AZURE_SPEECH_REGION = os.getenv("AZURE_SPEECH_REGION", "")

# テキストを受け取って音声データ（バイト列）を返す関数を定義
async def text_to_speech(text: str) -> bytes:
    # Azureへの接続を設定
    speech_config = speechsdk.SpeechConfig(
        subscription=AZURE_SPEECH_KEY,
        region=AZURE_SPEECH_REGION,
    )

    # 使用する音声を指定
    speech_config.speech_synthesis_voice_name = "en-US-JennyNeural"

    # メモリ上で音声を生成
    synthesizer = speechsdk.SpeechSynthesizer(
        speech_config=speech_config,
        audio_config=None, # None にしてバイト列で受け取る（Supabase Storageにアップロードするため）
    )

    # 現在動いている非同期処理の管理者（イベントループ）を取得
    loop = asyncio.get_event_loop()
    
    # Azure SDKの同期処理を別スレッドに投げて、完了したら結果を受け取る
    result = await loop.run_in_executor(
        None,
        lambda: synthesizer.speak_text_async(text).get(),
    )

    # 成功なら音声データを返し、失敗なら原因を添えてエラーを投げる
    if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
        return result.audio_data
    else:
        cancellation = result.cancellation_details
        raise RuntimeError(f"音声生成に失敗しました: {cancellation.reason} / {cancellation.error_details}")
