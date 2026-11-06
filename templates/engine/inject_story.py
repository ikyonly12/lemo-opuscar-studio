import os, sys, json, base64

def main():
    engine_dir = os.path.dirname(os.path.abspath(__file__))
    story_json_path = os.path.join(engine_dir, 'story.json')
    b64_payload = os.environ.get('TREATMENT_B64', '').strip()
    if b64_payload:
        try:
            decoded_bytes = base64.b64decode(b64_payload)
            data = json.loads(decoded_bytes.decode('utf-8'))
            with open(story_json_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print(f"[OK] Wrote decoded story data to {story_json_path}")
        except Exception as e:
            print(f"[!] Warning decoding treatment: {e}")
    else:
        print("[*] Preserving pre-configured project story assets")

if __name__ == '__main__':
    main()
