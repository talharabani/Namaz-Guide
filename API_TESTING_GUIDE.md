# 🔧 AI Service API Testing Guide

## Step-by-Step Guide to Test Your AI Service Connection

### 📋 **Prerequisites**
- Your app should be running in development mode
- Console logs should be visible
- Internet connection is required

### 🚀 **Step 1: Open the AI Assistant Screen**
1. Navigate to the AI Assistant tab in your app
2. You should see the AI Assistant interface with a blue bug icon (🐛) in the header

### 🔍 **Step 2: Test API Key Validation**
1. **Tap the blue bug icon** in the header
2. **Check the console logs** for:
   ```
   🔍 Step 1: Validating API Key...
   ✅ API Key format looks correct
   ```
3. If you see ❌ instead of ✅, your API key has an issue

### 🌐 **Step 3: Test API Connection**
1. After API key validation passes, the app will automatically test the API connection
2. **Check console logs** for:
   ```
   🔍 Step 2: Testing API Connection...
   🔍 Testing AI Service Connection...
   📋 API Key (first 10 chars): AIzaSyC8dv...
   🌐 API URL: https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
   ```

### 📊 **Step 4: Interpret Results**

#### ✅ **Success Indicators:**
- Console shows: `✅ AI Service Test Result: { success: true, text: "..." }`
- Alert shows: `✅ AI Service is working correctly!`
- You can send messages and get AI responses

#### ❌ **Error Indicators:**
- Console shows: `❌ AI Service Test Failed: [error details]`
- Alert shows: `❌ AI Service is not responding`
- Check console for specific error messages

### 🔧 **Common Issues and Solutions**

#### **Issue 1: API Key Problems**
```
❌ API Key is too short or missing
❌ API Key format is incorrect (should start with AIza)
```
**Solution:** Check your API key in `services/aiService.ts`

#### **Issue 2: Model Not Found (404 Error)**
```
Publisher Model `gemini-1.5-flash-002` was not found
```
**Solution:** The model name has been updated to `gemini-1.5-flash`

#### **Issue 3: Network/Connection Issues**
```
API request failed: 404
```
**Solution:** Check internet connection and API endpoint

### 🛠️ **Debugging Steps**

1. **Check API Key Format:**
   - Should start with `AIza`
   - Should be at least 20 characters long
   - Should be from Google AI Studio

2. **Check Console Logs:**
   - Look for detailed request/response logs
   - Check for specific error messages
   - Verify API endpoint URLs

3. **Test Different Models:**
   - Primary: `gemini-1.5-flash`
   - Fallback: `gemini-pro`

### 📱 **Manual Testing**

1. **Send a Test Message:**
   - Type: "Hello, are you working?"
   - Press send
   - Check if you get a response

2. **Check Error Messages:**
   - If you get error messages, check console for details
   - Look for specific error codes and messages

### 🔄 **Troubleshooting Checklist**

- [ ] API key is correct and valid
- [ ] Internet connection is working
- [ ] Console logs show detailed information
- [ ] No 404 errors in console
- [ ] API test button shows success
- [ ] Can send messages and get responses

### 📞 **If Still Having Issues**

1. **Check the console logs** for detailed error messages
2. **Verify your API key** is active in Google AI Studio
3. **Try the fallback model** (gemini-pro)
4. **Check your internet connection**
5. **Restart the development server**

---

## 🎯 **Expected Console Output (Success)**

```
🔍 Step 1: Validating API Key...
✅ API Key format looks correct
🔍 Step 2: Testing API Connection...
🔍 Testing AI Service Connection...
📋 API Key (first 10 chars): AIzaSyC8dv...
🌐 API URL: https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
Making request to: https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyC8dv...
Request body: { ... }
Response status: 200
✅ AI Service Test Result: { success: true, text: "Hello! I'm working correctly..." }
```
