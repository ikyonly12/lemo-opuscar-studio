import os
import sys
import json
import base64
import re

def main():
    engine_dir = os.path.dirname(os.path.abspath(__file__))
    story_json_path = os.path.join(engine_dir, 'story.json')
    index_html_path = os.path.join(engine_dir, 'index.html')

    b64_payload = os.environ.get('TREATMENT_B64', '').strip()
    topic = os.environ.get('TOPIC', 'Inovasi Sejarah Tersembunyi').strip()
    style = os.environ.get('STYLE', 'paper-popup').strip()
    language = os.environ.get('LANGUAGE', 'id').strip()
    aspect_ratio = os.environ.get('ASPECT_RATIO', '16:9').strip()

    data = None
    if b64_payload:
        try:
            print("[*] Decoding Base64 treatment payload...")
            decoded_bytes = base64.b64decode(b64_payload)
            data = json.loads(decoded_bytes.decode('utf-8'))
            print(f"[*] Decoded story title: \"{data.get('title', 'Untitled')}\"")
        except Exception as e:
            print(f"[!] Warning: failed to decode Base64 payload: {e}")

    if not data:
        print("[*] Generating baseline dynamic story structure...")
        data = {
            "title": topic,
            "topic": topic,
            "style": style,
            "language": language,
            "aspectRatio": aspect_ratio,
            "shots": [],
            "subtitles": [],
            "voiceLines": [{"t": 1.0, "text": topic}]
        }

    # Ensure required fields exist
    if 'style' not in data or not data['style']:
        data['style'] = style
    if 'aspectRatio' not in data or not data['aspectRatio']:
        data['aspectRatio'] = aspect_ratio
    if 'language' not in data or not data['language']:
        data['language'] = language

    # Save to story.json
    with open(story_json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"[OK] Wrote story data to {story_json_path}")

    # Inject into index.html
    if os.path.exists(index_html_path):
        with open(index_html_path, 'r', encoding='utf-8') as f:
            html = f.read()

        injection = f'<script>window.STORY_DATA = {json.dumps(data, ensure_ascii=False)};</script>'
        if 'window.STORY_DATA =' in html:
            html = re.sub(r'<script>window\.STORY_DATA = .*?;</script>', injection, html, flags=re.DOTALL)
        else:
            html = html.replace('</head>', f'{injection}\n</head>')

        with open(index_html_path, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"[OK] Injected dynamic STORY_DATA into {index_html_path}")

if __name__ == '__main__':
    main()
