# Humanized AI Customer Support Solution for DEWA Channels (CCC, CHC, Website & Mobile)

> **Confidential – For Internal Use (DEWA)**

Initiative Name Page 1 of 39 Business Requirements Document
Confidential Business Relationship Management
I&TF – Customer Happi ness Department
Humanized AI Customer Support Solution for DE WA channels (Contact
Center, Customer Happiness Cent res, Website and Mobile App)

Business Requirements Document
Initiative Name Page 2 of 39 Business Requirements Document
Confidential Business Relationship Management
Statement of Confidentiality
The information contained in this document and related artefact s constitute confidential information of Dubai Electricity &
Water Authority (DEWA) and intended for internal usage purpos es only. In consideration of receipt of this document, the
recipient agrees to maintain such information as confidential and not to reproduce or otherwise disclose this information to
any person outside the group directly responsible for evaluation of its contents, unless otherwise authorized by DEWA in writing.

Document Control The final version should be and integer V1.0, V2.0 etc. If there is any revisions it should be mentioned as V1.1, V2.3, etc. V2 .0
mean a second revision cycle was initiated.
Date Author Version Change reference
# 21 March 2024 Noora Alali V1.0 DEWA Website Enhancements
# 03 Sept. 2024 Abeer Eladawy V1.0 AI-Powered Customer Support for Online Services with
Multilingual Navigation and Application
6th Feb 2025 Abeer Eladawy V1.0 CCC, CHC-Humanized AI solution
# 03 March 2025 Laila Bandeali V1.1 DEWA Website Enhancements update on V1.0
# 19 March 2025 Laila Bandeali V2.0 Incorporated CX channel survey 2024 recommendations for
DEWA Website
# 8 April 2025 Noora Alali V2.1 Include the Government initiatives & the annual reports of
2024
# 14 April 2025 Laila Bandeali V3.0 Updated all the comments from the workshop held on 9th
April 2025
# 28 May 2025 Laila Bandeali V4 .0 Updated all the comments as received from CH, EXM,
Technical MORO team
# 29 May 2025 Laila Bandeali, Noora Alali,
Abeer Eladawy V5.0 Consolidated AI Powered & DEWA Website Revamp
# 09 June 2025 Laila Bandeali V5.1 Append ed comments from Ms. Abeer to V5.0
# 13 June 2025 Laila Bandeali V5.2 Appended AI capabilities comments from Ms. Abeer to V5.1
# 12 Sept 2025 Abeer Eladawy V6.0 Consolidat ed BRD: CCC, CHC Humanized AI, with AI-
Powered Customer -Support fo r Online Services (website
and Mobile app)
# 15 Sept 2025 Laila Bandeali, Abeer Eladawy V6.1 Appended DEWA website enhancements to V6.0
Final consolidated BRD: CCC, CHC Humanized AI, with AI-Powered Website Enhancements & Customer - Support for
Online Services (Website and Mobile app)

Initiative Name Page 3 of 39 Business Requirements Document
Confidential Business Relationship Management
## Table of Contents

I&TF – CUSTOMER HAPPINESS DEPARTMENT ................................................................................................................... 1
1. OVERVIEW .............................................................................................................................. ...................................... 4
## 1.1 INITIATIVE DETAILS .............................................................................................................................. .................... 4
## 1.2 INITIATIVE DESCRIPTION .............................................................................................................................. ........... 4
## 1.3 USER EXPERIENCE DETAILS .............................................................................................................................. ........ 6
### 1.3.1 AFFECTED USER CATEGORY (MULTIPLE ANSWERS ALLOWED) ......................................................................... 6
### 1.3.4 SERVICE / PRODUCT AFFECTED ........................................................................................................................... 7
## 1.4 PROCESS DESCRIPTION .............................................................................................................................. .............. 8
2. REQUIREMENTS DETAILS: .............................................................................................................................. .............. 8
## 2.1 PROCESS/SCENARIO REQUIREMENTS ..................................................................................................................... 8
## 2.2 PROCESS/SCENARIO REQUIREMENTS ................................................................................................................... 16
## 2.3 PROCESS/SCENARIO REQUIREMENTS ................................................................................................................... 20
## 2.4 DASHBOARD AND REPORTING REQUIREMENT ..................................................................................................... 34
3. APPENDICES .............................................................................................................................. ................................. 39
3. 1 APPENDIX I -DEFINITIONS , ACRONYMS, AND ABBREVIATIONS ............................................................................... 39
## 3.2 APPENDIX II –REFERENCE MATERIAL .................................................................................................................... 39
4. APPROVALS & ACKNOWLEDGMENTS ....................................................................................................................... 39

Initiative Name Page 4 of 39 Business Requirements Document
Confidential Business Relationship Management
1. Overview
## 1.1 Initiative Details
Initiative Name CCC, CHC Humanized AI, with AI-Powered Website Enhancements & Customer -
Support for Online Services (Website and Mobile app)
Department/Division Customer Happiness /I&TF

## 1.2 Initiative Description
The AI powered DEWA Customer Website aims to enhance website performance, streamline navigation, and improve
customer experience through the implementation of various features and enhancements such as AI-Powered customer support
for online services with multilingual navigation and application . The revamped website with AI-Powered customer support for
online services will align with DEWA's commitment to innovation, efficiency, accessibility, user-friendliness of the application
process or any general information and customer happiness while adhering to standards, guidelines, best practices and
incorporating feedback from various sources.

The AI powered customer support solution will empower every DEWA customer with a seamless, AI-enhanced digital
experience that enables them to apply for services independently, without the need to contact the call center or visit service
centers. This initiative will transform customer service from a reactive model to a personalized, proactive, and fully digital
experience by introducing a multilingual AI-driven virtual assistant to guide customers through th e various online services,
including both transactional and non-transactional processes. This system will integrate with DEWA’s existing CRM systems and digital platforms, offering features such as real-time guidance, error handling , and seamless human- agent handovers to
enhance the efficiency and accessibility of services on the DEWA website, mobile app, and other digital touchpoints.
This Business Requirements Document (BRD ) also outlines DEWA’s vision for a Humanized AI solution at Contact Center
and Customer Happiness Center. It focuses on delivering AI-f irst support for the customer s and the CCC/CHC staff while
ensuring smooth handover to human agents when needed, supporting custom er happiness, cost opti mization, and automation
maturity. The initiative aims to implement an AI-driven solution to humanize all contact centre touchpoints with Customer
Happiness Centres—including IVR, inbound calls, email, chat, outbound calls, Quality Management —through AI-Agent for
agents. This solution will enhance customer interactions across all channels, improve satisfaction, streamline operations, and
empower/boost agent productivity while reducing direct intera ctions with customers and operational costs. By integrating
advanced AI within the agent interface duri ng escalations or second-lev el support, it ensures a seamless customer experience
aligned with DEWA’s commitment to exceptional service delivery.
The interaction model will prioritize AI Agents to handle custom er inquiries first. If AI cannot fully resolve the issue or det ects
dissatisfaction (via sentiment analysis), the case will escalate to a Live Agent. All escalations will include full context tra nsfer
and conversation history for a seamless experience. Moreover, the agentic AI will work for the backend team such as quality
management team, outbound team and more.

Initiative Name Page 5 of 39 Business Requirements Document
Confidential Business Relationship Management
DEWA has consistently received feedback highlighting challenges such as multi-step service navigation, unclear application
guidance, and the lack of 24/7 digital support. These gaps result in increased customer frustration, lower adoption of digital
channels, and higher call center volumes.
Customer feedback from all the channels an d sources needs to be studie d and analyzed so as to come up with the detailed
action plan to improve the Website and the SQLs using AI. For ex : from a look and feel, navigation, search, content, performanc e,
services etc…. perspective.
Key expected outcome
- 50% reduction in call, chat, emailvolum e to call center within 6 months.
- 70% reduction in website, smart app support tickets within 6 months.
- Reduce the average handling time from 6 minutes to 4 minutes within 3 months
- Reduce the manual work of quality management team by 60%.
- 90% user satisfaction with AI -guided service applications.
- 99% customer satisfaction through websites, smart app channels and call centers within 6 months
- 50% decrease in customer visits to service centers.
- Seamless integration with DEWA’s digital platforms.
- Personalized, real-time guidance for users, including logged-in and non-logged-in customers.
- 24/7 availability of support with AI-driven contextual responses.
- CRM integration for automated ticket creation, user profiling, and customer segmentation.
- Accessibility enhancements for people of determination (POD).
- Advanced dashboards and reporting to analyse customer interactions and improve services.
- Full AI integration across all digital platforms (Web/App/Rammas/Hayak)
- AI-first interaction flow with seamless escalation to agents
- AI Knowledge Graph for continuous learning and improvement
- Smart sentiment analysis, empathy dete ction, and contextual agent assist
- Customer 360 integration across CRM, SAP, CPMS
- Personalized video responses and self-service jo urney guidance across DEWA consumer Services
- Accessibility compliance and multilingual real-time translation
- Supervisor dashboards, escalation alerts, and quality controls
- Role-based access, audit logs, and feedback for AI model tuning
- Deflection tracking and quarterly AI performance review
In nutshell, the requirement is threefold:
1. To engage a third party, who can study, do comprehensive an alysis of the customer feedback including service quality
levels (SQL) received through various sources; suggest and implement a detailed improvement plan for DEWA channels
including website, smart app, Rammas, CCC, CHC adhering to the DDA guidelines and DEWA brand requirements.
2. Introducing an AI-driven solution for online customer support designed to transform customer interactions with
our online services, enhancing the efficiency, accessibility, and user-friendliness of the application process or any
general information. This initiative aims to elevate custom er experience by offering seamless support and guidance
through our digital channel such as website, mobile app, and Rammas with HAYAK and Ashi’r. Key goals include streamlining the application process, reducing errors, mini mizing customer frustration, and decreasing the volume
of calls, emails, chats to the customer care center, and visits to the customer happiness center and eventually
Initiative Name Page 6 of 39 Business Requirements Document
Confidential Business Relationship Management
increase the adoption. Furthermore, it seeks to boost overa ll satisfaction and accessibility with 24/7 virtual support.
The AI support system will accommodate both logged-in and non- logge d-in customers, tr ansactional and non-
transactional services, to ensure an inclusive and effect ive customer service experien ce across various engagement
levels.
3. To study and implement Humanized AI solu tion at Customer Contact Center and Customer Happiness Center (Avtar on
virtual screen)
Customer feedback studies will include but not limited to the following:

a) Feedback from voice of customers gath ered from 43 sources, including surv eys, feedback forms, and customer
interactions.
b) Insights from the Instant Happiness Index to identify areas for improvement based on customer feedback.
c) Feedback from customer experience surveys conducted year ly to measure satisfaction and identify pain points.
d) Feedback from mystery shoppers who evaluate the website from a customer perspective.
e) Results from POD surveys to gather feedback directly from customers using DEWA services.
f) Feedback from DGE (Digital Government Excellence ) to address specific website usability issues.
g) Website roadmap demands raised by st akeholders and users to prioritize feature development and enhancements.
h) Audit notes comments to address any compliance or usability issues identified in DEWA Channels.
i) DDA (Digital City Experience Dimension) standards to ensure compliance with accessibility and inclusivity guidelines.
j) Feedback from IDCXS (International Digital Customer Experi ence Summit) to incorporate best practices and industry
trends.
k) Govt Unification initiative to revamp the homepage and align with the broader digital transformation goals of the
government.
l) 360 policy (Dubai Model) to ensure alignment with government policies and initiatives promoting digital innovation
and customer-centric services.

## 1.3 User Experience Details
### 1.3.1 Is there any name to be used for the marketing or it is the same existing name?
a. Yes there is marketing name, دﰊ وﻣﻴﺎه ﻛﻬﺮﺑﺎء ﻫﻴﺌﺔ ﻣﻮﻗﻊ Dubai Electricity & Water Authority Website
b. No, please mention the existing name ……………………………
### 1.3.2 If it is a service, is there any othe r service affected (related Services):
a. Yes, please specify ………………………………
b. No (standalone)
### 1.3.1 Affected User Category (multiple answers allowed)
Select from below and add if required
Initiative Name Page 7 of 39 Business Requirements Document
Confidential Business Relationship Management
# Product Name (Yes / No, name if others)
# 1 Individual – Expats Yes
# 2 Individual – UAE Nationals Yes
# 3 Business – Commercial Yes
# 4 Business – Industrial Yes
# 5 Government\Semi Government Yes
# 6 Developers
# 7 Contractors\Consultants
# 8 Partners
# 9 Suppliers
# 10 Public Yes
# 11 Employee, please specify the employee category Yes
# 12 Others ……..

### 1.3.2 The service\product will be hosted on: (multiple answers allowed):
a. DEWA Website
b. DEWA Smart Application (IOS)
c. DEWA Smart Application (Android)
d. Internal/Employee Platform, please mention: CCC……………………………………
e. Smart Office App (for executive reports and dashboards)
f. Other Platforms, please mention: …RAMMAS, CHC, HAYAK, Ashi’r………………………………

### 1.3.3 Is there any of the requirements belo w needed? (Multiple answers allowed)
# Product Name (Yes / No, name if others)
# 1 Policy change
# 2 Updating information related to the service\product ✓
# 3 Marketing campaign (marketing plan to be attached) ✓
# 4 Staff training ✓
# 5 New\update MOU with partners
# 6 Other, please specify

### 1.3.4 Service / Product affected
Current services, products that will be affected by implementing this initiative.
Initiative Name Page 8 of 39 Business Requirements Document
Confidential Business Relationship Management
# Name Type Description
# 1 Service / Product Accessibility to the service\product, How Easier with the AI
support………………………….
Speed of service\product delivery, How …Website performance
improvement…
Professionalism of the staff, How Virtual AI assistant……………………………… Customer Privacy, How Authenticati on process, privacy statements as

available…………………………………………
Service \Product ease of use, How Easier with the AI support ………………
Quality of Information related to the service\product, How website content
revamp and IVR revamp as AI/Agentic AI are data driven ………
Appearance of service\product, How Improved Navigation …………………
Other, please specify the area and explain how ………………………

All of the above SQL will be impacted as these will be improved based on the many customer feedback received through various
data sources. Collation and qualitative study of all the customer voices regarding the improvement of SQLs will be part of the scope of work of this turnkey project whereby the Vendor will recommend and implement the improvements of the service
quality levels as mentioned above.

## 1.4 Process Description

Process Owner: I&TF - CH, I&TF – Web, Smart app & Rammas teams, Relevant consumer
services/content owners of DEWA business divisions
IT System: Avaya, Sitecore, SAP, VOC, Rammas, AI sy stems, Smart App backend, Smart office

2. Requirements Details:
## 2.1 Process/Scenario Requirements
This subsection provides details of all business requirements for Process/Scenarios
AI powered DEWA Website enhancement requirements
# Requirement Title Process/Scenario 1 (Customer Requiremnts)
Process/Scenario Details Process Identifier SAP/Module/Process No/Doc .Type/Req.No/Version
Process Name: Processes related to CCC, CHC, DEWA Website, DEWA Smart App, RAMMAS,
backend customer and CCC employee related SAP and call centre processes
Initiative Name Page 9 of 39 Business Requirements Document
Confidential Business Relationship Management
Website Enhancements &
General Requirements - Improve website performance
o Improve website performance to ensure faster loading times and smoother
user experience.
o Tool to continuously monitor website performance across all pages and
functionalities, proactively identifying and resolving any bugs or
performance issues to maintain a sm ooth, responsive, and optimized user
experience.
- Website performance to be improved by using Headless platform. (e.g.,
homepage loads under 3 seconds for 10K concurrent users).
- The navigation menu contains a vast amount of information, with multiple
categories and subcategories.
- Simplify the navigation with a more concise, collapsible menu. Adding
breadcrumbs or sticky navigation bars could help users keep track of where they
are on the site.
- When a manual performance evaluation for the frequently used services i.e.
testing performed on multiple billing services, it was observed that the
performance issue were mainly re ported in the following modules
o Sign In
o View Bill
o Transaction history
- Eliminate duplicate pages
o Eliminate duplicate pages and optimize content organization to enhance
clarity and usability. (ex: Expo)
- Enhance customer Experience
o Enhance customer experience through improved navigation, personalized
content, and AI-powered search functionality.
o Linking of Rammas to websit e tabs, pages is missing
o Better classification of data, tabs, pages etc…
- Improved AI Powered Search
o Improve AI powered search that accurately understands customer needs
and redirects them to the appropriate service or information. personalizing
user experience with relevant and tailored content including the user intent
AI modelling.
- Align with DDA standards
o Align with DDA standards to ensure accessibility and inclusivity for all users
following the below Guidelines.
Web Content Accessibility Guidelines (WCAG) 2.1
Mobile Accessibility: How WCAG 2.0 and Other W3C/WAI Guidelines Apply to Mobile
Web Content Accessibility Guidelines (WCAG) 2.2 (with AAA)
Guidance on Applying WCAG 2.2 to Mobile Applications (WCAG2Mobile)

Design system guidelines: https://designsystem.dubai.ae/
Initiative Name Page 10 of 39 Business Requirements Document
Confidential Business Relationship Management

o Implementing Dubai Design System components that can be applied across
the entire DEWA website at once, including and not limited to:
o Foundations
- Typography
- Colors
- Icons & Visuals
- Images
- Layout & Breakpoints
o Components
- Gov Unification
- Accordion
- Alert
- Attachment
- Avatar
- Breadcrumbs
- Buttons
- Call to Action
- Cards
- Checkbox
- Chips
- Filters
- Footers
- Modals & Popups
- Number Field
- Pagination
- Phone Number Field
- Progress Bars
- Quick Select
- Radio Button
- Rating
- Search Field
- Service Header
- Sliders
- Stepper
- Tabs
- Text Area Field
- Text Field
- Toggles
- Tooltip
- Widgets
Initiative Name Page 11 of 39 Business Requirements Document
Confidential Business Relationship Management
- Accessibility has become a fundamental aspect of web development, ensuring
that websites are usable by everyone, regardless of their abilities or
disabilities. The Web Content Accessibility Guidelines (WCAG) 2.1 & 2.2
provide a comprehensive framework for making web conten t more accessible.
Among these guidelines, achieving the AAA level is the highest standard,
representing the most inclusive an d accessible form of web design.

- Enhance SEO (onsite/offsite)
o Enhance SEO (onsite/offsite) to improve visibility and ranking on
search engine results pages.
- Schema markup for the main pages is an essential step in enhancing the
website's search engine optimization. By adding structured data, you can help
search engines understand the content of your pages better and present rich
snippets in search result s. This can increase the visibility of your website,
drive more organic traffic, and improve your click-through rates.
Implementing schema markup can also assist in featuring your content in
voice search results, thereby expanding your reach to a broader audience.
- Enhance Navigation & sitemap
o Enhance navigation and sitemap to facilitate easier exploration and
access to information.
o Enhance the omni-channel experience by ensuring seamless navigation
and uniform functionality and information across all the digital
platforms (website, smart ap p, RAMMAS and other digital
touchpoints).
- Optimize Sitecore feature usage
o Optimize Sitecore feature usage to le verage the full capabilities of the
content management system (Sitecore).
- Improve Rammas Powered by GPT
o Improve Rammas powered by GPT to enhance the quality and accuracy
of customer interactions.
o Ensure a seamless transition to a human agent while chatting with
Rammas providing customers with an effortless escalation path when
needed.
- Low carbon Website Version
o Develop a low carbon website version to align with environmental
sustainability goals.

Look and Feel of Website
- L a n d i n g p a g e i s t o o b u s y w i t h t o o m u c h c o n t e n t . N e e d s t o b e s i m p l i f i e d a n d
services/content must be clubbed under main icons
- The website doesn’t feature animated banners, which would provide a more
contemporary digital experience for users
Initiative Name Page 12 of 39 Business Requirements Document
Confidential Business Relationship Management
- Landing page should be simple and it should not be lengthy and should not contain
more media. Revisit the landing page and explore ways to make bill payment
services more prominent.
User Experience - Simplify Navigation to Payment Page : Customers have repo rted that there are
too many steps to reach the payment page and view their bill. It should be
accessible from the first tab, as the current process requires multiple clicks. Add a
feature in the App/Website that allows customers to see expected bill amount as
per the daily reading.
- Recurring Payment Feature : The recurring payment feature allows DEWA
customers to conveniently set up automati c payments for their bills. This feature
ensures that your payments are made on time, every time, without the hassle of
manual transactions. By enabling recurrin g payments, you can avoid late fees and
maintain a consistent payment schedule, providing peace of mind and financial
stability. This functionality supports both fixed and variable payment amounts,
making it adaptable to your billing needs. Set it once, and let the system handle
your monthly DEWA bill payments effortlessly.
- One-Step Payment Feature for Bills [without login]: The one-step payment
feature [without login] simplifies the bi lling process, enhancing user experience
and encouraging more transactions. By enabling users to pay their bills with just a
single click, this feature reduces the complexity and time involved in manual
payments. It streamlines the entire paym ent journey, making it effortless and
efficient, thereby boosting user satisfaction and engagement. This functionality
caters to the modern user's need for quick and convenient solutions, ensuring that
transactions are completed swiftly and securely.
- Page Customization : Allow customers to select up to six frequently used services
as quick search options. Similar to personalizing a mobile home screen or email
inbox, customers should be able to drag and place frequently used service icons at
the top of the website or application page as per their own preference. Customers
should be able to personalize their dashboards.
- Improve Website Usability with better de sign for clarity of DEWA services.
- Create favorite pages/services for easier accessibility.
- Suggesting (through AI or business rules based on transactiona l history) addition
of the most frequently used services to favourites
- To ensure services information are aligned and updated throughout all digital
channels . Unified content management. In addition to ensure RAMMAS since it
uses Gen AI shouldn’t give outcomes diff erent in content than website. Accuracy
is a key.
- Present the DEWA bill amount with clarit y in case of credit amount. for example:
Credit amount of 2000 as currently in the bill it shows 2000-
- DEWA Login to be enhanced for ease and accessibility
- Unified username/password policy across all the digital channels
Initiative Name Page 13 of 39 Business Requirements Document
Confidential Business Relationship Management
o Username: Unifying all Username creation requirements as some time in
DEWA website accept space in username but in DEWA App all the time not
allowing space in the username
o Passwords: Unify all password requirements as sometimes DEWA website or
APP accept any password without uppercase or special characters
o Forget password: When customers approach DEWA to get the username
usually DEWA staff will request for forget password and the customer will
receive an email. The link in the email should ideally be directed to a page
where they can create a new password, but the link just takes them to a
"forgot password" page without allo wing them to set a new password.
- Icons: Icons to be clear and meaningful for ex: “Create New Account” icon and
“View Bill” icon are not clear to customers.

Website Content - Website content issues arises with the go lives and upgrades whereby the old
content appears on the website replacin g the new, revised content. Tools and
process clarity to addre ss the issue is needed.
- Once any update takes place on a page, that particular version should be saved in
the backend, so content versions of al l pages are available for reference and
historical tracking.
- Certain pages that have been removed from the website still appear if the old link
is clicked.
- There are some pages on the website that are available in various places (same
page but in a different section on website) . It has been noticed that when content
on a certain page is updated it does not reflect on the remaining duplicate pages.
This area needs to be enhanced.
- To have similar design/organization for both website and Smart app pages so that
content is reflected in a more organized way
- Centralized content library with English, Arabic content for labels, sentences,
articles and all the content alongwith the context and other details for easy access
and updattion of the content.
- Website content creation and update workflow to be devised to ensure governance
and excellence. DEWA website has hundreds of pages which require regular review
(other than the Service Guide). Compilation of list of every single page and
assignment of an owner/coordinator responsible for its regular review and update.
- Tutorial Videos : Add tutorial videos for various services under the Service guide
for customer convenience. For example, we currently have a 20-minute video
tutorial for creating a DEWA online account. However, some service tutorial videos
available on YouTube are outdated and need updating along with tagging link to
proper service. Like https://www.youtube.com/watch?v=9a19RwBgHuE
- Complete data model and tutorial video strategy to be devised for the creation and
updation of the videos.
Initiative Name Page 14 of 39 Business Requirements Document
Confidential Business Relationship Management

Language Translation - Recognizing the diverse backgrounds of our users, we need to introduce a feature
to support content in multiple languages. This initiative aims to make our platform
more inclusive by offering translations in several languages, such as Urdu, Chinese,
Tagalog, and more, alongside English and Arabic. By providing content in users'
native languages, we enhance accessibili ty and ensure a more personalized and
engaging user experience.

Co-browse
- Enhance the co-browse engine to allow call centre teams to view the user's screen
in real time. This feature enables customer support representatives to provide
more efficient and precise assistance by seeing exactly what the user is
experiencing. Implementing this technology will significantly improve the support
process, reducing resolution times and in creasing customer sa tisfaction. Currently
the co-browse solution has limitations of rendering.

CDN implementation
- To enhance website speed, implement a Content Delivery Network (CDN) for static
content delivery. This will ensure that users have faster access to the website’s
resources by distributing content ac ross multiple servers globally. This
optimization is crucial for improving user experience and reducing load times.

Heat maps feature
- To visualize user behaviour, Heatmaps show where users move, click, and scroll, so
customers can remove friction and convert with confidence. This powerful tool
enables to gain deeper insights into user interactions, allowing to optimize the
design and functionality of the website for an enhanced user experience.

Recording feature
- This feature provides invaluable insights into user experience by allowing the
customers to observe and understand their interactions in real time. By reviewing
these recordings, it can pinpoint areas of friction, identify common pain points, and
make informed decisions on where to im plement improvements. This functionality
not only aids in troubleshooting but also helps in refining the user interface and
overall user satisfaction.

Social media wall - Add Social Media Wall feature it should be dynamic and engaging feature that
showcases live feeds from our various social media platforms. It curates real-time
updates, posts, and interact ions, providing visitors with a vibrant snapshot of our
online community. This feature not only highlights the latest news and events but
also fosters a sense of community and interaction.

Unify a channel to reach and
get answers As of today, DEWA has
- Hayak chat [For contacting with Customer care] text chat and audio/ video
call
- Ashr : in mobile app for POD for contacting customer care
- Rammas : for bot and knowledge base and payment
Initiative Name Page 15 of 39 Business Requirements Document
Confidential Business Relationship Management
- Rammas powered by chat gpt with Knowledge base and AI capabilities
We need to unify the follow for user to get information and reach customer care.
These different channels to be consolidated and unified.

CI/CD
- Continuous Integration/Continuous Deployment (CI/CD), DevOps, and
DevSecOps are essential methodologies in modern software development that aim
to streamline processes, improve collaboration, and enhance security measures.
- Continuous Integration (CI) is the practice of automatically integrating code
changes from multiple contributors into a shared repository several times a day.
This process includes automated testing to ensure that the new code does not
introduce bugs or break ex isting functionality.
- Continuous Deployment (CD) takes CI one step further by automatically deploying
the integrated code to production environments, ensuring that new features,
updates, and fixes are released frequently and reliably.
Solution which will be implemented as part of the website enhancement scope should
follow DEWA’s DevSecOps practice as above.

A/B testing
- Introduce a test and learn approach with personalization that connects customer
experience across every channel.

Email platform with
analytics
- Ability to generate an Email camp aign to promote Website pages with
customizable email templates and ability to deliver emails to different segment of
users based on persona and other attributes

Recurring defects identified
during quality testing - Most issues reported during testing, as well as in customer app user reviews, are
related to the following services
o DEWA Locations (mainly EV Charger locations)
o Chat with Rammas
o Home page Search feature
o Slowness Issue while loading the services (Refer Slide 7 for the details)
o DEWA Store
o Sometimes Foreign language (Chinese characters) gets displayed on the
website
o Many broken links in service guides
o Customer complaints related to payment gateway downtimes
- Accessibility Testing Challenges
o During accessibility testing of the DEWA website by specialized testers,
several challenges are identified. For instance, when evaluating the "I am
blind" feature, the test ers struggled to understand the text, and the data
was not clearly located or pointed out. This highlights the need for
improvements in the application to better support users with a range of
accessibility needs.
Initiative Name Page 16 of 39 Business Requirements Document
Confidential Business Relationship Management

## 2.2 Process/Scenario Requirements

AI-Powered customer support for online services (DEWA Website & Mobile App)
# Requirement Title Process/Scenario 2 (Customer Requirements)
Process/Scenario Details
Intelligent Virtual
Assistant: - Initiate Walkthroughs:
o the AI should support or guide the customer step-by-step how to apply for
any service or provide input explanat ions, tutorial that helps customer
understand how to apply for any service or navigate for any information
o User guidance/support should be available on demand or initiated
proactively.
- Downloadable Walkthroughs:
o Allow customers and staff to download walkthroughs and other documents from
the platform in several formats.
- Ticket Creation and CRM Integration :
o Enable ticket creation and integrate with existing CRM tools (Trigger all
Persona ticket Use cases in one pool (system)).
- 24/7 Availability:
o Provide round-the-clock support to answer queries, provide information, and
guide users through the application process on the website and mobile app.
- Context-Aware Responses:
o Utilize Gen AI to proactively understand user intent, perceptions, reactions and
context, offering accurate and relevant responses or directing users to appropriate information or links.
o (Optional Scope) Leverage the gathered insights and behaviours to enhance
customer experience analytics and improve customer segmentation, profiling,
and personas, thereby supporti ng informed decision-making
- User Interaction Analysis:
o Analyze interactions to improve user flow based on feedback.
- Interactive Guidance:
o Offer step-by-step instructions for the ap plication process with options to email
or send instructions in multiple languages.
- Customer Happiness Staff Empowerment:
o Enable staff to assist customers step-by- step without data entry, similar to the
AI bot or send the same via email, SM S, WhatsApp, or chat, with editable
options for smart modifications.
o Handover between AI bot to Human Agen t depend on the log of the customer
once it stacks.
- Troubleshooting Tips:
o Provide tailored support for common is sues and additional downloadable
Initiative Name Page 17 of 39 Business Requirements Document
Confidential Business Relationship Management
documents to support the customer to resolve the issue with interruption
diagnosis.
- Issue Reporting:
o Simultaneously notify the relevant team of issues with screenshots via email,
SMS, or WhatsApp, and automatically create and route troubleshooting tickets.
- Extended Support/Escalation Mechanism:
o A multi-level escalation pr ocess should be established to proactively offer
assistance when the system detects user confusion, frustration, or errors. If the
AI is unable to resolve the issue throug h initial guidance, troubleshooting, or
tutorials, the issue and related data shou ld be seamlessly transferred to a human
agent via live chat, co-brows ing, or other methods.
o A ticket should be created and forwarded to the team concerned, integrating
with our CRM system, VOC, SAP and AVAYA.
Personalized Journey &
Recommendations - Custom Pathways (Optional Scope):
o Suggest personalized pathways an d shortcuts based on application
history and profile information.
o The solution should be able to dynamically track and analyze user
journeys and interactions, promptly flagging any deviations from
predefined journey maps/paths to the relevant team(s).
- Relevant Resources:
o Offer links to FAQs, instructional videos , and articles pertinent to the user’s
situation.
Real-Time Application
Assistance - Form Filling Support:
o Assist with form filling, data validation, and provide guidance by AI tool or
descriptions for each field. Help users navigate to the required information.
- Error Handling:
- Detect and alert users to errors or missing information in real-time, offering clear
correction instructions.
Proactive Notifications and
Reminders: - Application Status Updates:
o Keep customers informed of applicatio n status with timely notifications
about progress, approvals, or additional required actions.
- Reminders (Bot + Gen AI):
- Send automated reminder s for upcoming deadlines or missing documents to
ensure timely completion of applications.
Integration with User
Accounts: - Seamless Experience:
o Offer a unified experience by integrat ing DEWA CRM system, allowing users
to resume applications or access su pport from any device across digital
channels (website, mobile app, Rammas, HAYAK).
o Seamless integration with DEWA existing support features, such as Smart
Support Solution, Rammas, Hayak, and Co-browsing, eliminating the need for a separate touchpoint
- Personalized Interaction:
o Utilize user profile data for tailored support and follow-up on past
- interactions or issues.
Initiative Name Page 18 of 39 Business Requirements Document
Confidential Business Relationship Management
Multichannel Support: - Platform Integration (Optional Scope):
o Embed the AI solution within the website, mobile app, Rammas, HAYAK and
Ashi’r, ensuring omni channel experience consistency and convenience across
- all platforms.
POD and other special
categories . o AI to recognize registered POD and display the page as per their disability
needs
o AI shall assist customers in locating POD information by directing them to the
appropriate POD webpage.
o Guidance messages shall be enhanced wi th accessibility features including
"Read Speaker, Avatar, contrast switches, and text resizing” options
o In addition to providing tips and guidance while applying for the services, the
system shall offer customers the option to view tutorial videos on how to apply
for DEWA services.
o Voice-Activated Assistance: AI-powered voice assistants can help customers with
visual impairments or mobility challenges navigate digital channels and services
using voice commands. This eliminates th e need for keyboard or mouse input.
o Screen Reader Compatibility: AI can opti mize content for screen readers, which
are crucial for customers with visual impair ments. It can ensure that text, images,
and interactive elements are accessible and properly labeled for these tools.
o Real-Time Transcription and Captio ning: For customers with hearing
impairments, AI can provide real-time transcription and closed captioning for
audio and video content. This ensures they have access to the same information
as hearing customers.
o Text-to-Speech and Speech-to-Text: AI ca n convert text into speech for visually
impaired users and transform speech into text for users with hearing impairments
or those who have difficulty typing, enabling them to interact more easily with
digital platforms.
o Personalized Accessibility Settings: AI can learn from user interactions to
provide personalized accessibility settings, such as text size adjustments, color
contrast modifications, and other inte rface customizations that cater to
individual needs. Gesture and Eye-Tracking Support (Optional Scope): AI can support gesture
recognition and eye-tracking technologies, al lowing users with physical disabilities
to navigate digital platforms without traditional input devices like a mouse or keyboard.
o Simplified User Interfaces: AI can offer simplified or alternative user interfaces
for those with cognitive disabilities, reducing complexity and helping users focus
on essential tasks without overwhelming information or navigation options.
o Predictive Text and Auto-Completion: For customers with motor disabilities, AI
can enhance typing efficiency by predicting text and offering auto- completion
suggestions, reducing the effort required to input information.
o Automated Assistance and Troubleshooting: AI bots can offer immediate,
Initiative Name Page 19 of 39 Business Requirements Document
Confidential Business Relationship Management
automated assistance and troubleshoot i ssues in a user-friendly manner, helping
users with disabilities to resolve proble ms without needing extensive navigation
or searching.
o Inclusive Content Creation: AI can assist in creating inclusive content that
considers the needs of all users, includ ing those with disabilities, ensuring
o that all digital materi als are accessible and easy to understand.
Dashboard and Reporting: o Offer advanced analytical capabilities to create a comprehensive and flexible
dashboard/report that highlights areas for improvement, tracks support requests
by service and channel, monitors the number of downloads by service and
category, and logs communications sent through SMS, email, and WhatsApp.
o Provide reporting capabilities with easy-to-build reports and dashboards
o based on DEWA needs
Automated /Personalized
Text and Visual Content
Creator The AI-powered content creator should have the ability to assist in generating,
optimizing, and managing content in multip le languages, & integrated with Content
Management System (Sitecore) -Optional if required- with features such as
o Automated Content Generation: The AI bot can automati cally create content
based on predefined criteria, such as service steps , landing page and service
descriptions, and ensure alignment with specific topics, keywords, or themes.
o Adherence to Guidelines: Content generated by the AI bot should comply with
DEWA brand guidelines and regulatory requirements, maintaining consistency and high quality.
o Visual Content Creation: The AI bot should be capable of generating visual
content, such as images, infographics, an d videos, based on textual input or data.
o Adaptive Learning: The AI bot should learn from customer interactions and
feedback to continuously enhance the qu ality and relevance of the content it
generates.
o Personalized Content: The AI bot can customize content for different
persona by analyzing user data and behavior, tailoring messages, formats, and recommendations to boost relevance an d engagement for specific segments.
o Multilingual Support : The AI can create and translate content into multiple
languages, making it accessible to customers of all nationalities.
o Quality Enhancement : The AI can improve content quality by checking
grammar, spelling, punctuation, and stylistic consistency, providing
suggestions to enhance readability and clarity.
o Content Repurposing : The AI can adapt existing content for different formats
or platforms, such as conv erting step-by-step /service instructions into a video
script.
o Interactive Content Creation : The AI can generate interactive content like
quizzes, polls, to engage customers directly, and analyze engagement data to
refine content strategies further.

Initiative Name Page 20 of 39 Business Requirements Document
Confidential Business Relationship Management

## 2.3 Process/Scenario Requirements
This subsection provides details of all business requirements for Process/Scenarios. Please replicate the table in case of
multiple scenarios/use cases/processes
Humanized AI solution at Contact Ce nter & Customer Happiness Center
# Requirement Title Use Case/Process/Scenario 3 (Please provide Process/Scenario name here)
Process/Scenario Details
Background:
Currently, contact centre staff manage a high volume of inquiries across multiple
communication channels, calls, email, chat, ou tbound, Visits to customer happiness centres
leading to increased workload, longer response times, and higher operational costs.
Implementing an AI-driven solution will streamline interactions, improve response
efficiency, and enhance the overall customer experience.

Objectives:
Unified Customer 360 View with real time sy nc by ensuring the Customer 360 view is
synchronized in real time across all chan nels and systems. Any updates made through
self-service or by agents should reflect inst antly across CRM, IVR, and AI platforms. Also
integrate with SAP billing, smart meter data, notification history, CPMS, AVAYA and
relevant external sources to present a truly unified and real-time profile.
Incorporate a unified Customer 360 profile within the AI agent and Live Agent interfaces.
This should include billing history, service requests, usage trends, prior support interactions, outage reports, and sentimen t scores. This ensures both AI and human
agents are fully informed, resulting in faster and more accurate resolutions. (What
customer is seeing on his login sh ould be seen by staff and AI
Contact Center
- implement an AI-driven solution that humanizes all touchpoints within the contact
center—including IVR, inbound calls, email/Smart Support Solution, chat, and outbound calls
- AI-driven suggestive responses for ca lls, chats, and emails/ Smart Support
Solution.
- Backoffice Integration, en sure service appointments, outage reports, and job
progress can be tracked through the CRM. Both AI and Live Agents should have
access to field activity status to keep customers informed. Also the AI should
schedule an appointment with field staff (BSD/W&C/DP)
- Enhancing customer experience, operatio nal efficiency, and agent productivity.
Initiative Name Page 21 of 39 Business Requirements Document
Confidential Business Relationship Management
- Reduce call, to an agent and enhance self -service adoption through implementing
conversational IVR, were the agentic AI can answer all general inquires and make
service request on behalf of the customer
Note: General inquires available on the DEWA website and most focused on
consumer part
- Improve response accuracy an d efficiency with real-time AI suggestions thru agent
assist.
- Ensure seamless alignment with DEWA’s commitment to exceptional service
delivery.
Business Requirements:
The AI solution will cover the following touchpoints:
- IVR (Interactive Voice Response)
- Inbound Calls
- Email
- Chat (Web and Mobile)
- Outbound Calls
- Reporting
- Quality Management
Each touchpoint will be enhanced with AI-d riven capabilities such as natural language
understanding (NLU), sentiment analysis, and self-service options to provide a seamless,
human-like experience.

Conversional IVR (Interactive Voice Response)
- Natural Language Understanding (NLU) for conversational IVR.
- Context retention to avoid repetitive questions.
- Enhance the Dynamic self-service currently av ailable the vendor to drive this, either
to have one layer on the top of existing services with additional services required or
suggest revamping with AI (depen d on technology selected)
- Seamless escalation to human agents when needed with context transfer,
sentiment and voice tone dedication with recommendation what required to be
done.
- Support customer by voice direction to reach to the required menu and perform
the request based on voice command and after deciding point 3
- Attend all general customer questions by providing the info based on website and
sending the service link via SMS (FAQ/Ser vice Guide and any General information
on DEWA website
- the IVR to complete the service on behalf of customer based on customer
commands (as if the customer on website and without entering /typing) we can
start with certain services mentioned below and for activating the service thru bot
Initiative Name Page 22 of 39 Business Requirements Document
Confidential Business Relationship Management
on IVR we can provide option for customer, Virtual assistant or with normal IVR ( lt
the customer choose to gather mor insights as well)
- Customer Should have an option on the beginning and can be changed easily by
admin either to be served with the agentic AI with escalation Metrix to an Agent
(2nd level of Support) or Customer to have an option to speak to agent directly with AI to dedicate that customer need to speak to an agent, once the staff
receive the call it should be with full history what was going on at the IVR
- Expand self-service portals and IVR with embedded video walkthroughs powered by
AI Agents. Customers can choose to escalate to a Live Agent when video or automation doesn’t meet thei r needs. Enable video-to-case/interaction log linking
for full context.
FOR IVR : Transaction Personal Identification Number (TPIN)
- To implement a TPIN for registered cust omers so the customer can enter their
TPIN before speaking to an agent and once verified the system would indicate to
the agent that the customer is verified, allowing them to skip the usual verification questions.
- Introduce voice verification, as we have observed that a bank within the UAE (FAB)
is utilizing this method for verification before transferring a call to an agent if applicable and recommended by the vendor.
- The system should have an option to bypa ss the verification process either through
TPIN or voice verification to prevent customer frustration during emergencies or
when they are unable to verify.
AI Agent Assist should include:
- Sentiment analysis to identify frustrated or unhappy customers.
- Real-time transcription and assistance for live agents.
- Personalized greetings and interactions based on customer history.
- AI suggests responses for staff, prepare what staff should inform the customer
based on the customer history and interaction
- Integration with existing CRM, ticketing, and knowledge base (website, knowledge
management systems.)
- Real-time sentiment analysis to gauge customer emotions.
- Multilingual support to a ssist customers in their pr eferred language, Arabic,
English, Urdu are the main.
- AI-driven suggestive responses for calls.
- Live transcription of voice interactions with sentiment tagging.
- Next Best Action (NBA) recommendations based on real-time conversation
context.
- AI Agents to learn from resolved case s and update suggestions in real-time
Initiative Name Page 23 of 39 Business Requirements Document
Confidential Business Relationship Management
- Automated customer authentication status updates on the agent interface in case
if the customer is verified thru IVR.
- Smart routing and prioritization of inquiries based on urgency, customer type and
complexity example blackout dates/rainy season.
- Continuous learning from interactions to refine AI responses over time.
- An alert email or SMS to supervisors for intimation when calls on queue reaches to
certain number of calls on queue (for example 20 calls)
- Alert to team leaders when temper of cu stomer raises and tone sounds angry so
team leader can intervene to guide agent. (Keyword available can be given and based on the technology selected)
- Real-Time Alerts and Insights: By integrating AI with your monitoring systems, it
can flag areas where KPIs are not being me t, allowing for quick intervention. For
example, if SQL fall below a threshold, the AI system can send automated alerts to
the team for follow-up.
AI Bot Skill Matching for Escalation
Enable skill-based routing during AI-to-human escalation. Match customer inquiries with
agents who have relevant expertise based on predefined profiles, improving first-contact
resolution.
- Billing Dispute Handling via AI
- Billing dispute clarifications should be directly handled via AI Agents. AI should also
detect billing anomalies and initiate proa ctive support or escalation to Billing
directly by arranging a meeting with billing Agent. ( speak to Billing Agent)
- Accessibility & Inclusion
- Ensure AI and interfaces are accessible according to WCAG standards. Support
screen readers, keyboard navigation, and alternative input/output for people of
determination. Enable voice/text toggle.
Role-based Access and Audit Trails, to ensu re system access is role-based, every AI
action, decision, and override by live agents is captured/logged with audit trails to
support , quality control and accountability in decision-making.
- governance and compliance. (Action Log in SAP)
- AI Coaching & QA Assist for Supervisors, to Integrate AI-powered insights for
supervisors to monitor and coach agen ts. Include communication scoring,
resolution effectiveness, missed opportun ities, and trend summaries to support
continuous improvement.
AI Knowledge Graph & Continuous Learning
Initiative Name Page 24 of 39 Business Requirements Document
Confidential Business Relationship Management
- Enable the AI Agent to learn from resolv ed cases by feeding successful responses
and actions into a knowledge graph. This al lows the AI to continuously improve its
recommendations and update the knowledge base automatically for future similar
inquiries.
- System do send automatic qu iz to targeted agents based on the latest elevation
subject (if agent interaction evaluated less on move in process, system to send this
respective agent quiz related to move in subject and intimate the superviors
- Summary about agent prformance to be available
More detailes After a customer case is completed (solved by AI or human agent),
- The system analyzes what worked well: What was the issue? How was it solved?
What answer helped? that learning is automatically fed back into the AI's brain
("Knowledge Graph").
So next time a similar issue happens the AI can give a bett er or faster answer for the
system becomes smarter over time — like it's learning from past experience.
- Agent Feedback Loop
Enable Live Agents to provide feedback on AI-suggested actions, such as thumbs
up/down ratings or comments on inaccuracies. This data should feed into future
model improvements.
- AI Performance Tuning Process
- Establish a quarterly AI model review and tuning process. This should include
analysis of resolution accuracy, sentimen t misclassification rates, and feedback
from unresolved queries or agent corrections.
AI Monitoring of SLA Breach and Proactive Alerts
The AI Agent must be capable of monitoring all customer notifications and system-
generated requests in real time from CRM. It should intelligently detect if any case is at
risk of breaching, or has al ready breached, the defined Service Level Agreement (SLA). In
such scenarios, the AI must tr igger proactive alerts to the respective business owners to
ensure timely escala tion and resolution.
Additionally, the Customer Happiness team requires visibility into these alerts to track
and follow up on overdue or delayed cases. This will enhance service responsiveness,
improve governance, and ensure customer issues are resolved within agreed timelines.
AI-Driven Reporting & Automation Framework
Automated Operational Reports
All recurring operational reports—including but not limited to:
Initiative Name Page 25 of 39 Business Requirements Document
Confidential Business Relationship Management
- Average Handling Time (AHT) comparisons
- Staff performance (daily, monthly, yearly)
- Drop interval tracking
- Wrap-up analytics
- Abandonment reports
- Customer sentiment surveys
will be fully automated. Dashboards will be dynamically generated by AI, pulling directly
from live system data. This ensures real-time visibility, eliminates manual errors, and
guarantees timely delivery of actionable insights.
Excel File Generation & Amendments
AI will also handle the creation and continuous updating of essential Excel-based reports
and tracking sheets, including:
- Attendance reports
- Training schedules
- KPI trackers
- Zero-tolerance quality monitoring files
This automation removes the need for manual data entry, significantly reduces the risk of
inconsistencies across departments, an d enhances operational efficiency.
AI-Driven Reporting and Automation Framework
Automated Operational Reporting
The organization’s recurring operational reports—including, but not limited to, Average Handling Time (AHT) comparisons, staff pe rformance reports (daily, monthly, and
yearly), drop interval tracking, wrap-up an alytics, abandonment reports, and customer
sentiment surveys—will be fully automated.
Dashboards will be dynamically generated by AI, drawing directly from live system data.
This will ensure:
- Real-time, accurate insights
- Elimination of manual errors
- Timely availability of information for decision-making
Automated Excel File Generation and Updates
AI will also oversee the generation and amendment of essential Excel-based reports and
tracking tools, including attendance report s, training sheets, KPI trackers, and zero-
tolerance quality monitoring files.
By automating these processes, the organization will:
Initiative Name Page 26 of 39 Business Requirements Document
Confidential Business Relationship Management
- Eliminate reliance on manual data entry
- Reduce inconsistencies across departments
- Improve overall operational efficiency and data integrity
Contact Center KPI Analysis
Detailed analysis of Contact Center performance at both team and individual staff levels
across all channels (calls, emails, chat, video) will be handled automatically by AI. The system will flag any performa nce drops, escalate repeated issues to management, and
highlight improvement areas, including adherence and attendance anomalies.
Quality Monitoring
- AI-powered tools will evaluate daily call, email, and chat lively, assess long
hold/duration times, outbound calls, and detect potential social media risks
through real time speech anal ytics. Business-critical devi ations and escalation cases
will also be identified and reported automatically to the relevant teams.
- Automatic evaluations to all interactions based on set criteria such as greeting,
using customer name, closing, offering assi stance) and escalate calls with issues to
concerned team.
- Flexible search based on phrase or ke y words by different languages to find
interactions related to the selected words.
Workforce Management (WFM)
- AI will support WFM by continuously mo nitoring roster accuracy and forecast
adherence for both short- and long-ter m planning, ensuring optimal resource
allocation in real-time and give alert to staff /supervisor fo r any changes to the
plan of the staff roster.
- Mobile application to be available and integrated with Smart Office
Outbound Call Process Enhancement
- Automate the process of pulling all unhappy/neutral calls from Sap and IVR survey
report and uploading them in POM
- Assigning the votes to the exiting agents for call outs.
- Popup each customer vote result on SAP screen for the agent to enable agent to
call knowing the customer history and nature of the negative vote.
- AI-based scheduling and prioritization of outbound calls based on data analysis of
the unhappy customer available on the CRM and based on the staff logged in and their skills.
- Personalized call scripts based on customer history and preferences.
- Fill the form automatically based on customer interaction with staff
- Automated follow-up calls if no response from customer.
- Generate automated report and dashboard
Initiative Name Page 27 of 39 Business Requirements Document
Confidential Business Relationship Management
- Escalate to the supervisors with tagging (call type (out or Inbound calls) if any
frustration or appreciation shown
Proactive and Predictive Customer Support
Enable predictive AI capabilities such as abno rmal usage detection, and service disruption
anticipation planned and unplanned. Proactive alerts should be delivered to customers
and agents, enhancing responsiveness and trust. Before calling Contact Center and if he
calls Contact Center the IVR agentic AI should be able to inform the customer proactively based on account status
Emails /Smart Support Solution (SSS)
- Automated email/notification from SSS sorting and routing to appropriate agent
based on set of skills.
- AI-generated response sugges tions for common inquiries.
- Sentiment detection to prioritize urgent or sensitive emails.
- Contextual analysis of email history for tailored responses.
- Option to approve /reject/modify the response generated by AI
- Suggest creating a notification whenever applicable and if the staff approve, AI to
generate and provide Notificati on number to Staff /Customer
Chat (Web and Mobile)
Seamless escalation to live agents with conversation history In case if the Bot was not
able to answer the customer, or customer tran sferred to agent, the chatbots should have

- handle FAQs and ba sic inquiries.
- Sentiment analysis to identify frustrated or unhappy customers. And display to the
agent in his widget
- Multi-intent recognition to handle complex queries.
- Proactive suggestions for agents during live chat interactions.
- Capture the duplicated email-based on (sender & subject) for one agent to reply to
one of the duplicated emails only
Video Response Use Case:
- AI Agent provides pre-recorded video or Guide for common issues (e.g., how to
apply for Finalbill, how to check your consumption, how to self dignose).
- In case of escalation, the Live Agent can send personalized videos /guide to explain
steps for customer upon request.
- Videos will be logged and linked to case records or interaction log with view-
tracking metrics
Initiative Name Page 28 of 39 Business Requirements Document
Confidential Business Relationship Management
Non-Functional Requirements:
- Scalability: The solution must handle high volumes of interactions across all
channels by having scalable architecture.
- Security compliance & data privacy: Ensure compliance with data protection
regulations.
- Reliability: The AI must provide accurate, consistent responses across all channels.
- Performance: Low-latency responses to maintain system uptime and natural
conversation flow.
- Provide audit logs for tracking AI interactions and agent actions.
- Integration with existing communication platforms/CRM at Contact Center.

Business Features
- Staff handling calls/email, /outbound chat, social media to have within his screen
an AI agent assist widget across which w ill support the staff to attend customer
enquires with the following features:
- Real-Time Sentiment Analysis:
Identifies customer sentiment and displays it via a Sentiment Meter for all
channels, where Contact Center staff are involved including email, chat,
WhatsApp, , voice within staff interface and social media if Contact Center will
handle from sprinklr.
- Suggestive Responses:
1- Provides suggestive responses for email, calls, chat, which can be copied
and modified with the source of the suggested response, from the website,
knowledge management …etc
2- Incorporates empathetic language to improve customer experience.
- Real-Time Transcript for Voice Calls:
1- Generates transcripts of voice in teractions with emotion tagging.
2- Provides suggestive responses for calls after analyzing the calls , with the
source of the suggested response, from the website

Emotion Identification:
Tags emotions for text-based communication across touch points (calls, Email,
Chat and social media if Contact Center will handle from sprinklers.
- Overall Conversation Temperature:
Displays the overall emotional state of the conversation in real-time.
- Next Best Actions:
Initiative Name Page 29 of 39 Business Requirements Document
Confidential Business Relationship Management
Provides real-time suggestions for actions, including responses and knowledge base
recommendations.
- Ticketing Integration:
- Identifies conversation topics to suggest ticket creation.
- Suggest ticket updates for recurring issues.
- Interaction Summary:
Summarizes each interaction, editable by agents, to be saved as a wrap-up note. Or
to update the interaction record in SAP
Knowledge Base Integration:
Connects to website/FAQs, product information, and troubleshooting guides for
quick reference.
- Customer Journey Summary:
Provides a concise overview of previous interactions, including chatbot
conversations.
This will include AI Agent interaction logs, sentiment ratings during the session,
and transcript summari es of any video or voice input received.
- Contact Center Omnichannel Support/integrate:
Operates across voice, chat, email, and social media channels to ensure consistent
service.
Translation Capabilities:
Supports real-time bidirectional translatio n (e.g., English-Arabic) for email and live
interactions.
Contextual Guidance:
Provides real-time suggestions and recommendations to Agents based on the
ongoing conversation and previo us history with the customer.
Automated Responses:
Prepares and suggests responses to redu ce agent effort and improve accuracy.
Warm handover with context:
Upon escalation, the AI Agent will transfer the customer to a Live Agent along with:
Retrieves relevant CRM data and summariz es the customer's interaction with the
virtual agent, providing live agents with:

- Conversation history (Retrieves re levant CRM data and summarizes the
customer's interaction) - Sentiment trend
- Customer verification status ( on behalf or self)
Initiative Name Page 30 of 39 Business Requirements Document
Confidential Business Relationship Management
- AI recommendations and unresolved inqu iries a comprehensive view of customer
needs during live engagement. Transcript summaries enable agents to quickly
understand and address unresolved queries.

Authentication Status:
Displays authentication status on the AI-Agent Assist widget, including option for
SMS authentication and real-time status update on the widget.
CRM Integration:
Integrates with CRM systems and other backend systems to provide a unified view
of customer data and stream line processes. Facilitates easy ticket creation and
updates in CRM.
Language Support:
Allows agents to assist customers in their native language with real-time
translation.
Customer Information Retrieval: Displays relevant details such as contact history and account information for
personalized support.
Empathy in Responses: Enhances responses with empathetic language to ensure customer comfort. Call Wrap-Up Acceleration: Streamline call wrap-ups /tagging with interaction transcription, interaction
summary. AI-Agent Assist sh ould simplify post-c all tasks, reducing workload and
empowering the agents to manage more interactions efficiently.

Use Cases
The AI Agent Assist Solution should cover use cases across voice, chat, and email
channels. Real-time updates should be provided for voice and chat interactions, while
email interactions will offer one-time suggestive responses. Below are the detailed use cases samples
Final Bill Scenarios
- Identification of the account which is already passed through IVR with identified
status.
- Get Notification Details to confirm If moveout request is already created.
- Check If customer created Move Out or Move To request.
- Move To: Check disconnection date.
- Disconnection date still didn't pass.
Initiative Name Page 31 of 39 Business Requirements Document
Confidential Business Relationship Management
- Disconnection date passed.
- If Disconnection didn't happen
1- If customer delayed th e disconnection date
2- If Open High Consumption Notification is in pending status
- Create Follow up request If SLA breached.
3- Tenant is still living at location.
4- Other Status - approx 5 other status
- Disconnection Happened as per date selected by customer.
1- Check If Final bill generated.
- Final Bill Generated
- Customer mentions that Final bill not yet received.
- Check Final Meter Reading
- Final Bill not Generated (Disconnection is successful)
1- Final bill Reading is done but Final Bill is delayed.
- Final bill reading is not done.
- Check Moveout Notification
- Check Moveout Notification
1- Move out notification created.
2- No Moveout Notification but move out document created.
- System should check for new move-in
- KB Integration using DEWA Website
Disconnection Status Scenarios
- Check If DEWA status is disconnected.
- System will check type of Disconnection.
1- Due to Non-Payment.
2- Due to forced Moveout - (Owner)
3- Due to Dubai Municipality Mukhalfa
4- Due to RFU case
5- Due to Outage or shutdown (Water) / Tripping (Electricity)
- Due to Non-Payment.
- Payment Not Received Yet
- Payment Received
- Reconnection Notification ch eck - Notification created.
- Reconnection Notification chec k - Notification Not created.
- Due to forced Moveout - (Owner) Same as point no 10 in Final Bill
- Due to Dubai Municipality Mukhalfa
- Reconnection Notification created.
- SLA Not Breached
- SLA breached.
- Due to RFU case
Initiative Name Page 32 of 39 Business Requirements Document
Confidential Business Relationship Management
- Due to Outage or shutdown (Water) / Trippi ng (Electricity) - Information is in pdf
format which need to be referred. Sheet has Substation no
- Check If DEWA status is connected.
- Customer complains ab out disconnection.
High Consumption Scenarios
- If Customer is identified--> Show cu stomer profile with related Account.
- Else provide a field to insert Account Number.
- Display Open Tickets for this customer to show if high consumption ticket is
already open.
- Display Customer Information (Cus tomer Name, address, Outstanding
Amount)
- Provide Agent a button to confirm verification. Once clicked update the widget.
- Display 5 questions with Action button for agent to confirm.
- Analyse/compare customer behaviour and consumption an d then summarize
to staff to explain for the customer and then create a ticket in SAP by filling the details for staff to confirm with option to automate the ticket creation
All general Inquires: to be answered by the AI agent with source of the information from
the knowledge hub
Value Proposition of AI for the Call Center
- Enhanced Customer Experience:
1- Human-like interactions across all channels.
2- Faster resolution with self-service options.
3- Personalized and empa thetic responses.
- Increased Agent Productivity:
1- AI handles repetitive tasks, freein g agents for more complex issues.
2- Real-time assistance with sugg ested responses and insights.
3- Reduced agent burnout due to lower call volumes and improved workflows.

- Operational Efficiency:
1- Reduced average handling time (AHT) through automation.
2- Accurate call routing and prioritization.
3- Automated follow-ups and proactive notifications.
- Data-Driven Insights:
1- Sentiment analysis to identify customer pain points.
2- Analytics on customer behaviour and interaction trends.
3- Continuous learning to impr ove AI accuracy over time.
- Improved Compliance and Quality:
1- Consistent responses across all interactions.
2- Automated call monitoring and compliance checks.

Risks and Mitigation
Initiative Name Page 33 of 39 Business Requirements Document
Confidential Business Relationship Management
- Risk: Inaccurate AI responses.
1- Mitigation: Continuous training and fine-tuning of AI models.
- Risk: Customer resistance to AI-driven interactions.
1- Mitigation: Clear communication and option to speak with a live agent.
- Risk: Data security breaches.
1- Mitigation: Implement robust encryption and access controls.
Term Description
AI Knowledge
Graph A structured system used by AI to store and apply learned
interactions and outcomes for smarter recommendations.
Customer 360 A unified, real-time view of all customer data/journey including
CRM, billing, usage, and interaction history across channels.
Escalation Context
Transfer Transferring full customer intera ction history, profile data, and
AI insights from bot to agent during escalation.
Customer Happiness Centres
AI Agent Extension to Service Centers via Smart Screens (AVATAR)
To expand the reach and effectiveness of the AI Agent described in this BRD, the solution
will be extended to DEWA’s self-service centers through large smart screens. The
experience will begin with a virtual AI Agent (avatar) capable of interacting with customers, providing information, and performing transactio ns as outlined earlier in this document. If
further assistance is needed, the interactio n will seamlessly escalate to a human agent—
maintaining a hybrid digital-physical service experience.
In addition, all dashboards and performance metrics defined in this BRD such as deflection
rate, average handling time (A HT), escalation triggers, sentiment trends, and AI accuracy
will also be available for service center intera ctions. This ensures full visibility, governance,
and quality monitoring across both remote and on-site AI deployments.

Process/Scenario Controls
Validation (List of various controls and validations important in processing the information)
Integrations SAP /CPMS
Dependency (List the Impacts / Dependencies on other Sy stems, Processes or Modules and the level
of impact/dependency i.e. Major/Moderate/Minor)
Authorization System / App. Name:
Role: Coordinator / Manager / SM / Higher Mgmt, etc.
Permission: Admin/ Read/ Read & write etc.
Initiative Name Page 34 of 39 Business Requirements Document
Confidential Business Relationship Management
SMS/Email Content (If the Initiative requires any SMS/Emails notifications/communications to be sent,
please provide the content of those SMS/Emails.
## 2.4 Dashboard and Reporting Requirement
Across each touch point and as an overall
1. % of cases resolved by AI without escalation
2. scalation Rate to Live Agent
3. AI Sentiment accuracy vs Customer Feedback Score
4. Average handling time (AI vs. Live Agent)
5. track predictive AI accuracy, video engagement,
6. knowledge base effectiveness,
7. self-service completion rates.
8. real-time metrics on customer satisfaction trends and case deflection rates.
9. Deflection rate tracking to measure the percentage of inqu iries resolved by AI or self -service tools without agent
involvement.
10. Contact Center and Customer Happiness Agent performance

The benefits for DEWA and its staff /customers.
1. Enhanced Customer Experience
- Seamless Multilingual Support : The AI system will cater to DEWA's diverse customer base, offering multilingual
support that ensures customers can inte ract with the platform in their preferred language. This will lead to
smoother interactions, especially for non-Arabic speakers and expatriates.
- Real-Time Guidance : The AI assistant will provide step-by-step instructions, proactively guiding customers through
service applications, form-filling, and general information retrieval. This will minimize confusion and improve the
speed of task completion.
- Omni-Channel Availability : The virtual assistant will be integrated across DEWA’s website, mobile apps, and other
digital platforms like Rammas and HAYAK, ensuring that cu stomers have consistent experiences across all channels.
- Proactive Assistance : AI will identify user struggles through predictive behavior analysis and offer assistance before
the user explicitly asks for help, reducing frustration and improving user retention.

2. Increased Operational Efficiency
- Automated Issue Resolution : By leveraging AI to handle common qu eries and low-complexity tasks, DEWA will
reduce the number of issues requiring human intervention. This leads to quicker issue resolution and allows human
agents to focus on complex cases.
Initiative Name Page 35 of 39 Business Requirements Document
Confidential Business Relationship Management
- Reduced Support Costs : Automating routine customer support interactions decreases the overall cost per inquiry.
The system will reduce the volume of su pport calls, emails, and chats by resolving up to 80% of customer inquiries
without the need for human intervention.
- Error Reduction : With AI providing real-time form validation and error handling, customers will make fewer
mistakes when applying for services. This will result in fe wer rejected applications and fewer cases requiring manual
correction, improving process efficiency.
3. Higher Customer Satisfaction and Engagement
- 24/7 Availability : The AI assistant will provide round-the-clock service, allowing customers to resolve issues or
complete applications at any time, which is critical for meeting the needs of working pr ofessionals and international
customers across different time zones.
- Faster Service Completion : By offering instant support for FAQs, application procedures, and troubleshooting, the
AI system will significantly reduce the time customers spend navigating DEWA’s online services. This leads to higher
satisfaction rates and be tter service adoption.
- Improved Accessibility : The AI system will be designed with accessibility in mind, providing features for People of
Determination (POD), such as voice interaction, screen readers, and text-to-speech services, ensuring that all
customers, regardless of ability, can access DEWA services easily.
4. Reduced Call Center Workload
- Call Deflection : By resolving common issues throug h the AI assistant, DEWA’s call centers will experience fewer
inbound calls. This will allow human agents to spend mo re time on complex issues, improving the quality of
personalized support provided to customers who need it most.
- Decreased Chat and Email Volume : With intelligent, automated ticket cr eation and contextual responses, the
volume of chat and email queries directed to customer support will drop significantly. The AI will respond to
repetitive inquiries, thus lowering the burden on human agents.
5. Data-Driven Insights and Personalization
- Customer Behavior Analytics : The AI system will collect data on customer interactions and behaviors, providing
DEWA with insights into customer preferences, common is sues, and service bottlenecks. This data will allow DEWA
to make informed decisions regarding service improvements and updates.
- Personalized Experiences : Based on customer profiles and past interactions, the AI will offer personalized
pathways and recommendations, ensuring customers receive tailored support that aligns with their specific needs
and preferences. This will enhance engagement and satisf action, encouraging more frequent use of DEWA’s digital
services.
6. Inclusive Support for Multiple User Categories
Initiative Name Page 36 of 39 Business Requirements Document
Confidential Business Relationship Management
- Diverse User Segments : The AI system will be designed to acco mmodate various user categories, including
individual customers (expats and UAE nationals), busi nesses, government entities, contractors, developers, and
others. The virtual assistant wi ll provide tailored support for each segment, ensuring that the specific needs of each
user group are met.
- People of Determination (POD) : The AI will include specific functionalities that support POD, such as voice-
activated commands, real-time transcription, closed captioning, and adaptive user interfaces. These features will ensure DEWA’s services are accessible to all customers, regardless of their physical or cognitive abilities.
7. Seamless Integration Across Platforms
- CRM and Platform Integration : The AI system will be integrated with DEWA’s existing CRM tools, SAP systems,
and support platforms like Rammas, HAYAK, and Ashi’r, enab ling customers to transition between devices (website,
mobile app, smart platforms) without losing their place in the service journey. This will ensure a cohesive,
uninterrupted experience across all digital touchpoints.
- Ticketing and Escalation : If the AI assistant cannot resolve an issue, the system will seamlessly hand over the
inquiry to a human agent, ensuring that the customer does not have to repeat information or restart the process.
Tickets will be generated and forwarded to the appropriate department with full context.
8. Advanced Reporting and Continuous Improvement
- Comprehensive Dashboards : The AI-powered system will provide deta iled analytics and reports on customer
interactions, highlighting key performance metrics such as response time, issue resolu tion rates, and customer
satisfaction scores. DEWA can use this data to identify service gaps, optimize workfl ows, and continually improve
the quality of customer support.
- Feedback Loops : User feedback collected by the AI system will inform service improvements, allowing DEWA to
respond quickly to customer concerns and make adjustments to both the AI and human-supported service channels.

# 1 Summarizing AI capabilities and it s impact on users and operations
AI Capability Impact on User and Operations
AI-Powered Virtual Assist ant (Rammas) Provides 24/7 support, which:
1- Reduces load on call centers from calls, email &chat.
2- Improves customer satisfaction/experience.
Context-Aware Responses (Gen AI) Delivers relevant answers and guidance which:
1- Reducing user confusion and effort.
2- Improves customer satisfaction/experience.
Initiative Name Page 37 of 39 Business Requirements Document
Confidential Business Relationship Management
Interactive Guidance, Offer step-by-step
instructions for the application process
1- Simplifies complex processes.
2- Reduces error rates.
3- Enhances user confidence.
4- Reduces load on call centers from calls, email &chat.
5- Reduces visit to CHC’s
6- Improves customer satisfaction/experience.
Tutorials and Service Manuals 1- Improves self-service capability.
2- Reduces load on call centers from calls, email &chat/ reduces
dependency on agents.
3- Reduces visit to CHC’s
4- Improves customer satisfaction/experience.
Behavioral Analysis & Heatmaps 1- Identifies touch points and issues.
2- continuous UX improvements.
3- Improves customer satisfaction/experience.
Automated Ticket Creation & CRM
Integration 1- Streamlines issue resolution process.
2- supports faster SLA adherence.
Feedback Analysis 1- Identifies service gaps and improvement opportunities based on
real user input.
2- Improves customer satisf action/experience/ UX
AI-Powered Search 1- Improves customer satisfaction/experience.
2- Improves information discovery, speeds up ta sk completion.
Personalized Recommendations 1- Enhances engagement
2- Improves customer satisfaction/experience.
AI-Generated Content (Text & Visual) 1- Speeds up content updates and ensures multilingual, consistent
service info.
Voice-Activated Assistance 1- Supports visually impaired users, increasing accessibility.
Screen Reader Compatibility 1- Ensures inclusion of users with visual impairments.
Real-Time Captioning & Transcription 1- Supports hearing-impaired users and ensures information parity.
Text-to-Speech and Speech-to-Text 1- Enhance interaction for POD and users with limited mobility.
Initiative Name Page 38 of 40 Business Requirements Document
Confidential Business Relationship Management
Gesture & Eye-Tracking Support
(Optional) 1- Empowers users with physical di sabilities to navigate services
independently.
Personalized Accessibility Settings 1- Improves customer satisfaction/experience..
Automated Reminders & Status Updates 1- Improves follow-up rate and service completion by customers.
AI-Driven Email Campaigns 1- Increases reach and engagement through targeted communication.
AI-Powered Dashboards & Reporting 1- Supports data-driven decisions
2- operational optimization.

Name Dashboard Name
Version (If enhancement on an existing dashboard) Last Ver. Date NA if New
Description
Objectives/ Purpose Eg; Real-time Monitoring, Performance Measurement, Data Visualization, etc.
What are the Questions the Dashboard will answer?
Ex-Q1: What is the energy
consumption of a particular zone? Chart Type Bar/Pie Attributes: Historic
al data
needed Y/N
Ex-Q2: Which channel has the highest
overall adoption rate? Chart Type Bar/Pie Attributes: Historic
al data
needed Y/N
Ex-Q3: Which service has the lowest
online adoption and requires attention? Chart Type Bar/Pie Attributes: Historic
al data
needed Y/N
Business Value Capture the list of potential decisions/ operational improvements the dashboard will provide.
Owner Data owner.
Consumers Eg. H.E MD&CEO, EVPs, VPs, etc.
Publishing Channels Smart Office, DEWA Website, Freejna, SharePoint, emails, etc.
Source of data (Primary/Secondary/External) Eg: SAP(Primary), Excel, BW etc.
Frequency ☐Daily ☐Weekly ☐Monthly ☐Other (……………………………………………………….)
Data Filters 1 Eg: Period (from date -to date) 3
Initiative Name Page 39 of 39 Business Requirements Document
Confidential Business Relationship Management
# 2 Division wise 4
Calculation/ Equation Eg: Budget consumption calculation, lead time, scoring, SLAs ect.
Output Presented (
for Reports) 1 Table (attributes) 3 Maps
# 2 Chart attributes and labels (Bar, Pie,
Graph) 4 Drill down/ through.

3. Appendices
3. 1 Appendix I -Definitions , Acronyms, and Abbreviations
This subsection provides the definitions of all terms, acronyms, and abbreviations required to properly interpret the BRD.

Term Description

## 3.2 Appendix II –Reference Material
Document Title Location

4. Approvals & Acknowledgments
Approval
Name Signature Date
Business Owner
Business Representative(s)/
SME(s)

Acknowledged By
Name Signature Date
Product Manager
