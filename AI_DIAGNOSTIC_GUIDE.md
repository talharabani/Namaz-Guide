# 🔍 AI Assistant Diagnostic Guide

## 🚨 **If AI Assistant is Not Responding**

### **Step 1: Run the Comprehensive Test**
1. **Open the AI Assistant tab**
2. **Look for the blue "Test" button** in the header (top-right)
3. **Tap the "Test" button**
4. **Watch the console logs** for detailed information

### **Step 2: Check Console Logs**
Look for these specific log messages:

#### ✅ **Good Signs:**
```
🔍 Step 1: Validating API Key Format...
📋 Key length: 39
📋 Key starts with AIza: true
✅ API Key format looks correct
🔍 Step 2: Testing API Key with Actual Request...
📊 Response status: 200
✅ API Key test successful
```

#### ❌ **Bad Signs:**
```
❌ API Key is missing
❌ API Key is too short (should be at least 20 characters)
❌ API Key format is incorrect (should start with AIza)
❌ API Key test failed: 401 Unauthorized
❌ API Key test failed: 403 Forbidden
```

### **Step 3: Common Issues and Solutions**

#### **Issue 1: API Key Format**
```
❌ API Key format is incorrect (should start with AIza)
```
**Solution:** Your API key should start with "AIza" and be at least 20 characters long.

#### **Issue 2: API Key Not Working**
```
❌ API Key test failed: 401 Unauthorized
```
**Solution:** 
- Check if your API key is correct
- Verify the key is active in Google AI Studio
- Make sure you haven't exceeded API limits

#### **Issue 3: API Key Not Working**
```
❌ API Key test failed: 403 Forbidden
```
**Solution:**
- Check if your API key has the right permissions
- Verify the key is enabled for Gemini API
- Check if your Google Cloud project has billing enabled

#### **Issue 4: Model Not Found**
```
❌ API Key test failed: 404 Not Found
```
**Solution:**
- The model name might be incorrect
- Check if the API endpoint is correct

### **Step 4: Manual API Key Check**

1. **Go to Google AI Studio**: https://aistudio.google.com/
2. **Check your API key**:
   - Should start with "AIza"
   - Should be at least 20 characters long
   - Should be active and not expired

3. **Test your API key**:
   - Copy your API key
   - Go to the AI Assistant test
   - Check if it works

### **Step 5: Debug Information**

When you run the test, you should see:

```
🔍 Validating API Key...
📋 Key length: [number]
📋 Key starts with AIza: [true/false]
📋 Key (first 20 chars): AIzaSyC8dvwnD0aqLhqTnOxoTKTxE-S_cEcwubo...
✅ API Key format looks correct
🧪 Testing API key with actual request...
🌐 Test URL: https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent
📋 Test body: {...}
📊 Response status: [200/401/403/404]
```

### **Step 6: What to Do Based on Results**

#### **If API Key Format is Wrong:**
- Check the API key in `services/aiService.ts`
- Make sure it starts with "AIza"
- Make sure it's at least 20 characters long

#### **If API Key is Wrong (401/403):**
- Get a new API key from Google AI Studio
- Make sure it's enabled for Gemini API
- Check if your Google Cloud project has billing enabled

#### **If Model Not Found (404):**
- The API endpoint might be wrong
- Check if the model name is correct
- Try a different model

### **Step 7: Quick Fixes**

1. **Restart your development server**:
   ```bash
   # Stop current server (Ctrl+C)
   npm start
   # or
   expo start
   ```

2. **Clear app cache**:
   - Close the app completely
   - Restart the development server
   - Reload the app

3. **Check internet connection**:
   - Make sure you have internet access
   - Try opening Google AI Studio in your browser

### **Step 8: Get a New API Key**

If your API key is not working:

1. **Go to Google AI Studio**: https://aistudio.google.com/
2. **Sign in with your Google account**
3. **Click "Get API Key"**
4. **Create a new API key**
5. **Copy the new API key**
6. **Replace the old key in `services/aiService.ts`**

### **Step 9: Test Again**

After getting a new API key:

1. **Update the API key** in `services/aiService.ts`
2. **Restart your development server**
3. **Run the test again**
4. **Check the console logs**

---

## 🎯 **Expected Console Output (Success)**

```
🔍 Step 1: Validating API Key Format...
🔍 Validating API Key...
📋 Key length: 39
📋 Key starts with AIza: true
📋 Key (first 20 chars): AIzaSyC8dvwnD0aqLhqTnOxoTKTxE-S_cEcwubo...
✅ API Key format looks correct
🔍 Step 2: Testing API Key with Actual Request...
🧪 Testing API key with actual request...
🌐 Test URL: https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent
📋 Test body: {...}
📊 Response status: 200
📋 Response headers: {...}
✅ API Key test successful: {...}
🔍 Step 3: Testing Full AI Connection...
🔍 Testing AI Service Connection...
📋 API Key (first 10 chars): AIzaSyC8dv...
🌐 API URL: https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent
🚀 Starting AI request...
📝 User message: Hello, are you working?
🌐 Language: en
🔑 API Key (first 10 chars): AIzaSyC8dv...
🌐 API URL: https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent
🌐 Making request to: https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyC8dv...
📊 Response status: 200
✅ AI Response generated: Hello! I'm working correctly...
✅ AI Service Test Result: { success: true, text: "Hello! I'm working correctly..." }
```
