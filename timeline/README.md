## Abstract
Easily record your timeline through shortcuts app, visualize your time blocks in obsidian
## Use in Obsidian
```dataviewjs
await dv.view("timeline", {pages: ""})
```
## Steps for Creating the Shortcut
1. Choose from List

Define a List. The list items are start and end

Action: Choose from List

2. Use If to check different activity type

Action: If the variable value is "start", got to step 3, otherwise step 4

3. Choose from Menu

Action: Choose from Menu

Add my first-level category of activities. Then define a Dictionary in each options, and add specific categories. Action: Choose from List(Variable is Dictionary)

When it reaches the end menu, use Action: Ask for input to get some notes from users. Define a Dictionary to store the menu results, current time, activity type(result of step 1), and notes.
4. End the activity

Define a List to get the comments or rating of this activity. The list items can be the comments or feelings.

Action: Choose from List

Define a Dictionary to store current time, activity type(result of step 1), and comments.

Encode to JSON Use "Encode to JSON" to convert the dictionary into JSON.
5. Get backup File on GitHub

Action: Get Contents from URL

See Github api doc for parameters details.
Action: Get Dictionary Value to get the results of Github api in Json(get sha and content)

Action: Base64 Encode to decode the contents with base64

Action: Combine Text to combine the decoded contents and the dictionary from step 3 or 4

Action: Base64 Encode to encode the combined contents with base64

6. Upload backup File on GitHub

See Github api doc for parameters details.

Input data format
The input is the results from the Shortcuts app. Each entry represents an activity with its details.

{"tp":"start","n":"Wake up","e":"wake up","tm":"2025-03-24 08:50"}{"c":"Fantastic","tp":"end","tm":"2025-03-24 09:16"}

tp(Type) - defines whether the entry marks the start or end of an activity

n(Note) - A short description related to the activity(only present in "start" entries)

e(Event) - The category of the activity

tm(time) - The date and time of the activity in YYYY-MM-DD HH:mm format

c(Comment) - A rating of the activity (only present in "end" entries)
