import json
import re

transcript_path = r'C:\Users\choud\.gemini\antigravity-ide\brain\b14e9c5f-3c33-47aa-85cd-7cb84c30119b\.system_generated\logs\transcript_full.jsonl'
output_path = r'c:\Users\choud\Desktop\hack3\src\data\mockdatafinal.json'

with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            if data.get('type') == 'USER_INPUT':
                content = data.get('content', '')
                if 'iss_1788100626398' in content:
                    start = content.find('[')
                    end = content.rfind(']')
                    if start != -1 and end != -1:
                        with open(output_path, 'w', encoding='utf-8') as out:
                            out.write(content[start:end+1])
                        print(f'Successfully wrote JSON to {output_path}')
                        break
        except Exception as e:
            pass
    else:
        print('Could not find the JSON payload in transcript')


