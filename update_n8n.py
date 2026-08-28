import urllib.request
import json

API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3ZDdkMTI0Zi05NTA1LTRlZGQtYjVhYy01MTUyNDZhYzJmODAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiODg4MzZjM2MtOTczNy00ZjNlLWEwYWMtYTBmOGM3ZTExYzRmIiwiaWF0IjoxNzg3ODkzODQwLCJleHAiOjE3OTA0Mzg0MDB9.awJl5Bet3wXPUEVBWPRG5SdQuVRLBGPTsWznw8b17AE"

# 1. Fetch current workflow
req = urllib.request.Request("http://localhost:5678/api/v1/workflows/cduG0XcqNVJQhsbq", headers={"X-N8N-API-KEY": API_KEY})
with urllib.request.urlopen(req) as res:
    wf = json.load(res)

# 2. Update Send Confirmation parameters
for n in wf["nodes"]:
    if n["name"] == "Send Confirmation":
        n["parameters"]["chatId"] = "={{ $('Process, Deduplicate & Format').item.json.chatId || $json.chatId }}"
        n["parameters"]["text"] = "=✅ *Expense Logged via Gemini AI!*\n\n🍱 *Item:* {{ $('Process, Deduplicate & Format').item.json.title }}\n💴 *Amount:* ¥{{ $('Process, Deduplicate & Format').item.json.amount.toLocaleString() }} JPY (≈ ₱{{ $('Process, Deduplicate & Format').item.json.convertedAmountPHP.toLocaleString() }} PHP)\n🏷️ *Category:* #{{ $('Process, Deduplicate & Format').item.json.category.toUpperCase() }}\n💳 *Payment Method:* {{ $('Process, Deduplicate & Format').item.json.paymentMethod }}\n📅 *Date:* {{ $('Process, Deduplicate & Format').item.json.date }}\n📝 *Notes:* {{ $('Process, Deduplicate & Format').item.json.notes }}\n\n_Auto-added to TravelTokyo Paid Budget._"

# 3. Update via PUT
put_data = json.dumps({
    "name": wf["name"],
    "nodes": wf["nodes"],
    "connections": wf["connections"],
    "settings": wf["settings"]
}).encode("utf-8")

put_req = urllib.request.Request(
    "http://localhost:5678/api/v1/workflows/cduG0XcqNVJQhsbq",
    data=put_data,
    headers={"X-N8N-API-KEY": API_KEY, "Content-Type": "application/json"},
    method="PUT"
)

with urllib.request.urlopen(put_req) as res:
    print("PUT Success:", res.status)

# 4. Reactivate workflow
req_act = urllib.request.Request("http://localhost:5678/api/v1/workflows/cduG0XcqNVJQhsbq/activate", data=b"{}", headers={"X-N8N-API-KEY": API_KEY, "Content-Type": "application/json"}, method="POST")
with urllib.request.urlopen(req_act) as res:
    print("Reactivate Success:", res.status)
