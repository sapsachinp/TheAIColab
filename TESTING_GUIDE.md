# Testing Guide - Enhanced Humanized AI Features

## Overview
This guide covers testing all new enhancements for the Humanized AI Customer Support system.

## New Features to Test

### 1. Enhanced Customer Data (6 Diverse Profiles)
Test each customer account to verify different scenarios:

#### Test Account 1: Ahmed (C12345) - Warning Status
- **Login**: ahmed@example.com / password123
- **Expected**: 
  - Account Health: Warning (68/100) - Yellow badge
  - Issue: Bill increased from 200 AED to 320 AED
  - Historical Chart: Shows 8 months consumption with spike in Dec 2024
  - AI Tips: Should show energy optimization recommendations
  - Open Complaint: "High bill inquiry" ticket visible
- **Test Actions**:
  - View consumption history chart (should show upward trend)
  - Review AI recommendations for reducing bill
  - Test "Submit Request" button (proactive guidance)

#### Test Account 2: Fatima (C67890) - Excellent Status
- **Login**: fatima@example.com / password123
- **Expected**:
  - Account Health: Excellent (95/100) - Green badge
  - Issue: None - model customer
  - Historical Chart: Stable consumption around 180-190 AED
  - AI Tips: Congratulations message, maintain habits
  - No open complaints
- **Test Actions**:
  - Verify "Energy Efficient" badge display
  - Check if consumption comparison shows better than average
  - Test chatbot with praise-based queries

#### Test Account 3: Mohammed (C11223) - Good Status  
- **Login**: mohammed@example.com / password123
- **Expected**:
  - Account Health: Good (82/100) - Blue badge
  - Property: Villa with pool - higher baseline consumption
  - Historical Chart: Steady around 400 AED
  - AI Tips: Pool optimization, villa-specific tips
  - Pool pump maintenance reminder
- **Test Actions**:
  - Verify villa-specific recommendations
  - Test pool-related queries in chatbot

#### Test Account 4: Sara (C44556) - Critical Status
- **Login**: sara@example.com / password123
- **Expected**:
  - Account Health: Critical (35/100) - Red badge
  - Issue: Overdue bill + unexplained spike
  - Historical Chart: Recent spike from 220 to 510 AED
  - AI Tips: Urgent payment options + technical inspection
  - Open Complaint: "Bill spike investigation" visible
- **Test Actions**:
  - Verify urgent alert displays prominently
  - Test payment assistance flow in chatbot
  - Check if proactive guidance detects financial hardship

#### Test Account 5: Omar (C77889) - Good Status (Commercial)
- **Login**: omar@example.com / password123
- **Expected**:
  - Account Health: Good (88/100) - Blue badge
  - Property: Commercial office building
  - Historical Chart: Stable business usage 600-650 AED
  - AI Tips: Commercial optimization, off-peak usage
  - Account type shows "Commercial"
- **Test Actions**:
  - Verify commercial-specific recommendations
  - Test business hour optimization tips

#### Test Account 6: Layla (C99001) - Excellent Status (Star Customer)
- **Login**: layla@example.com / password123
- **Expected**:
  - Account Health: Excellent (98/100) - Green badge with star
  - Recognition: Energy Champion badge
  - Historical Chart: Consistently low consumption 130-140 AED
  - AI Tips: Eco-warrior status, community recognition
  - Solar panel impact visible
- **Test Actions**:
  - Verify "Energy Champion" special status
  - Check solar panel integration data

### 2. Humanized AI Interactions

#### Test Empathy Engine
1. **Billing Concern (Ahmed account)**
   - Go to Chatbot
   - Ask: "Why is my bill so high this month?"
   - **Expected Response**: 
     - Starts with empathy: "I completely understand your concern..."
     - Mentions specific consumption spike
     - Offers actionable solutions (breakdown, optimization tips)
     - Personalized with customer name
     - Includes emoji/visual elements (🔍)

2. **Financial Hardship (Sara account)**
   - Go to Chatbot
   - Ask: "I can't afford to pay this bill right now"
   - **Expected Response**:
     - Supportive tone: "You're not alone in facing financial challenges..."
     - No judgment language
     - Offers payment plan options
     - Escalation to human if needed
     - Includes supportive emoji (💙)

3. **Service Outage Query**
   - Any account
   - Ask: "When will power be restored in my area?"
   - **Expected Response**:
     - Apologizes sincerely for disruption
     - Acknowledges impact on daily routine
     - Proactive SMS update offering
     - Includes utility emoji (🔌)

4. **Proactive Praise (Layla account)**
   - Login as Layla
   - Chatbot should detect excellent status
   - **Expected Response**:
     - Congratulatory tone: "I love that you're taking a proactive approach..."
     - Recognition of energy-saving behavior
     - Encouragement emoji (💡)

### 3. Historical Consumption Visualization

#### Chart Display Test
For each account:
1. **Navigate to Customer Summary**
2. **Locate "Consumption History" section**
3. **Verify Chart Elements**:
   - X-axis: Shows 8 months (May 2024 - Dec 2024)
   - Y-axis (left): Amount in AED
   - Y-axis (right): Usage in kWh
   - Two lines:
     - Blue line: Bill amount with solid stroke
     - Green line: kWh usage with solid stroke
   - Predicted month (Jan 2025): Dashed line style
   - Grid lines for easy reading
   - Responsive hover tooltips showing exact values

4. **Compare Trends**:
   - Ahmed: Should show upward spike
   - Fatima: Should show stable low consumption
   - Sara: Should show dramatic spike
   - Layla: Should show consistently low usage

### 4. Account Health Score System

#### Health Score Display Test
1. **Visual Components**:
   - Score badge (colored by status)
   - Progress bar (0-100 scale)
   - Status icon (✓ for good, ⚠️ for warning, ⚡ for critical)
   - Status text (Excellent/Good/Warning/Critical)

2. **Color Coding Verification**:
   - Excellent (90+): Green (#10b981)
   - Good (75-89): Blue (#3b82f6)
   - Warning (50-74): Yellow (#f59e0b)
   - Critical (<50): Red (#ef4444)

3. **Score Calculation Context**:
   - View "What affects my score?" tooltip
   - Should show factors: payment history, usage patterns, account age

### 5. AI Recommendations/Tips

#### Personalization Test
For each account, verify recommendations are context-specific:

1. **Ahmed (Warning)**:
   - ✓ Review recent consumption spike
   - ✓ Check AC usage during peak hours
   - ✓ Consider payment plan options

2. **Fatima (Excellent)**:
   - ✓ Keep up the excellent work!
   - ✓ Your habits are saving you money
   - ✓ Share tips with neighbors

3. **Mohammed (Villa)**:
   - ✓ Optimize pool pump schedule
   - ✓ Villa-specific energy audit
   - ✓ Smart thermostat installation

4. **Sara (Critical)**:
   - ⚠️ Urgent: Schedule payment today
   - ⚠️ Request technical inspection
   - ⚠️ Contact us for payment assistance

5. **Omar (Commercial)**:
   - ✓ Shift loads to off-peak hours
   - ✓ Commercial efficiency audit
   - ✓ Demand management strategies

6. **Layla (Star)**:
   - 🌟 Energy Champion recognition
   - 🌟 Community ambassador program invite
   - 🌟 Solar panel expansion opportunities

### 6. Proactive Guidance Enhancement

#### Test Case Deflection
1. **Submit Request Form Test**:
   - Login as Ahmed
   - Go to "Submit Request"
   - Enter: "My bill is too high"
   - **Expected Proactive Response**:
     - AI intercepts before ticket creation
     - Shows confidence score (e.g., 85%)
     - Offers alternative solutions:
       - "View detailed breakdown"
       - "Get personalized energy tips"
       - "Compare with similar homes"
     - Option to proceed with ticket if unsatisfied

2. **Duplicate Detection**:
   - Login as Ahmed (has open "High bill inquiry" complaint)
   - Try to submit another billing complaint
   - **Expected**:
     - AI detects existing ticket
     - Shows: "You already have an open ticket (T001)"
     - Suggests: "Would you like to add details to existing ticket?"
     - Prevents duplicate creation

3. **Low Confidence Escalation**:
   - Submit complex technical issue
   - **Expected**:
     - AI confidence <70%
     - Automatically escalates to human agent
     - Shows: "This seems complex, connecting you to specialist..."

### 7. Chat Scenario Testing

#### Test Enhanced AI Logs
The system now has 12 humanized interaction scenarios:

1. **LOG001**: Billing inquiry (Ahmed) - Empathetic spike explanation
2. **LOG002**: Payment plan request (Ahmed) - Flexible options offered
3. **LOG003**: Service outage (Fatima) - Apologetic with updates
4. **LOG004**: Efficiency praise (Fatima) - Recognition and encouragement
5. **LOG005**: Payment assistance (Sara) - Non-judgmental support
6. **LOG006**: Spike investigation (Sara) - Technical inspection suggestion
7. **LOG007**: Move-in inquiry (Mohammed) - Friendly onboarding
8. **LOG008**: Pool optimization (Mohammed) - Villa-specific advice
9. **LOG009**: Invoice request (Omar) - Professional commercial service
10. **LOG010**: Off-peak optimization (Omar) - Business cost reduction
11. **LOG011**: Advisory request (Layla) - Praise and community invitation
12. **LOG012**: Duplicate detection (Layla) - Smart alternative offering

**Test Chatbot with these queries to trigger scenarios above**

### 8. Bilingual Support

#### Arabic Language Test
1. Switch language to Arabic (if implemented)
2. Test queries in Arabic:
   - "لماذا فاتورتي مرتفعة؟" (Why is my bill high?)
   - "أحتاج مساعدة في الدفع" (I need payment help)
3. **Expected**:
   - AI responds in Arabic
   - Maintains empathy and context
   - UI elements translate properly

### 9. Voice Integration (STT/TTS)

#### Voice Chat Test
1. Open Chatbot component
2. Click microphone icon 🎤
3. Speak: "Why is my bill high this month?"
4. **Verify**:
   - Speech recognized and transcribed
   - AI response plays via TTS
   - Voice has empathetic tone (not robotic)
   - Can interrupt and ask follow-up

### 10. Dashboard Analytics

#### Metrics Verification
1. Login as admin/view Dashboard
2. **Check Metrics**:
   - Ticket Deflection Rate: Should reflect proactive guidance successes
   - FCR (First Contact Resolution): % resolved without escalation
   - Prediction Accuracy: Predicted vs actual bills
3. **Charts**:
   - Real-time interaction volume
   - Intent distribution pie chart
   - Customer satisfaction trends

## Automated Testing (Future)

### Unit Tests to Create
```bash
cd backend
npm test

# Expected tests:
- intentDetection.test.js (classification accuracy)
- empathyResponse.test.js (template coverage)
- proactiveAdvisor.test.js (deflection logic)
- billPredictor.test.js (prediction accuracy)
```

### Integration Tests
```bash
cd frontend
npm test

# Expected tests:
- CustomerSummary.test.jsx (renders with all 6 accounts)
- Chatbot.test.jsx (handles all 12 log scenarios)
- RequestForm.test.jsx (proactive guidance triggers)
```

## Performance Testing

### Load Test
1. Simulate 100 concurrent users
2. Measure:
   - API response time < 500ms
   - Chart rendering < 1s
   - AI response < 2s

### Browser Compatibility
Test on:
- Chrome (latest)
- Safari (latest)
- Firefox (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

## Regression Testing

After any code changes, verify:
- [ ] All 6 customer profiles load correctly
- [ ] Charts display without errors
- [ ] AI responses maintain humanized tone
- [ ] Proactive guidance still intercepts requests
- [ ] Voice recognition still works
- [ ] No console errors in browser dev tools

## Bug Reporting

If you find issues, document:
1. **Account Used**: Which test customer
2. **Steps to Reproduce**: Exact actions taken
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happened
5. **Browser/Device**: Testing environment
6. **Screenshots**: Visual evidence
7. **Console Errors**: Any JavaScript errors

## Success Criteria

✅ All 6 customer profiles display unique, context-specific data
✅ Historical consumption charts render correctly with predictions
✅ Account health scores calculate and display with appropriate colors
✅ AI responses demonstrate empathy, personalization, and context awareness
✅ Proactive guidance deflects unnecessary tickets with confidence scoring
✅ Chatbot handles all 12 test scenarios with humanized responses
✅ Bilingual support works for English and Arabic
✅ Voice integration (STT/TTS) functions smoothly
✅ Dashboard analytics reflect real-time system performance
✅ No critical console errors or broken features

## Demo Flow for Hackathon

### 5-Minute Demo Script
1. **Login as Ahmed** (Warning status)
   - Show account health warning
   - Display historical spike in chart
   - Demonstrate AI detecting concern and offering help
   - Submit request → AI proactively deflects with suggestions

2. **Login as Sara** (Critical status)
   - Show urgent critical alert
   - Demonstrate empathetic payment assistance
   - Show AI offering flexible payment options
   - Highlight human escalation for complex cases

3. **Login as Layla** (Star customer)
   - Show excellent status celebration
   - Demonstrate AI recognizing and praising behavior
   - Display community recognition opportunities

4. **Voice Demo**
   - Use chatbot microphone
   - Speak natural query
   - Show AI understanding and responding with empathy via TTS

5. **Dashboard Analytics**
   - Show ticket deflection rate (target: >60%)
   - Display FCR improvements
   - Highlight cost savings for DEWA

## Notes
- All test data is in `data/customers.json` and `data/ai-logs.json`
- Backend runs on `http://localhost:3001`
- Frontend runs on `http://localhost:5173`
- OpenAI key optional - fallback templates work for demo
