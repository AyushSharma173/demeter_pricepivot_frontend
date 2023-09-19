//RESERVED
// UPLD Upload file
 
const ProQuestions=
[
    {
       "code":"GEND",
       "text":"What is your gender identity?",
       "options":[
          {
             "code":"MALE",
             "text":"Male"
          },
          {
             "code":"FEMA",
             "text":"Female"
          },
          {
             "code":"NONB",
             "text":"Non-Binary"
          },
          {
             "code":"PNS0",
             "text":"Prefer not to say"
          }
       ]
    },
    {
        "code":"UPCV",
        "text":"Upload your CV/Résumé",
        "options":[
           {
              "code":"UPLD",
              "text":"You can only upload a PDF or JPG file less than 5MB"
           },
         
        ]
     },
    {
       "code":"CERT",
       "text":"Are you a Certified Mental Performance Consultant?",
       "options":[
          {
             "code":"TRUE",
             "text":"Yes"
          },
          {
             "code":"FALS",
             "text":"No"
          },
        
       ]
    },
    {
      "code":"UPCR",
      "text":"Upload your certificate (AASP website)",
      "skipFor":{
         "code":"CERT",
         "answer":[
            "FALS"
         ]
      },
      "options":[
         {
            "code":"UPLD",
            "text":"You can only upload a PDF or JPG file less than 5MB"
         },
       
      ]
   },
   {
      "code":"MAST",
      "text":"Do you have a Master's or Doctoral Degree in Clinical, Counseling or Sport Psychology",
      "options":[
         {
            "code":"TRUE",
            "text":"Yes"
         },
         {
            "code":"FALS",
            "text":"No"
         },
       
      ]
   }, 
   {
      "code":"UPMA",
      "text":"Upload Certificate of master's or doctoral degree in clinical, counseling or sport psychology",
      "skipFor":{
         "code":"MAST",
         "answer":[
            "FALS"
         ]
      },
      "options":[
         {
            "code":"UPLD",
            "text":"You can only upload a PDF or JPG file less than 5MB"
         },
       
      ]
   },
   {
      "code":"LCLI",
      "text":"Are you a licensed clinician?",
      "options":[
         {
            "code":"TRUE",
            "text":"Yes"
         },
         {
            "code":"FALS",
            "text":"No"
         },
         {
            "code":"LNUM",
            "text":"Your license number",
            type:"text"
         
         },
         {
            "code":"LSTA",
            "text":"State where you hold your license",
            isTextInput:true,
            type:"text"
         
         }

       
      ]
   }, 
   {
      "code":"LADC",
      "text":"Do you have any aditional certificates?",
      "options":[
         {
            "code":"TRUE",
            "text":"Yes"
         },
         {
            "code":"FALS",
            "text":"No"
         },
         {
            "code":"LNAM",
            "text":"Name of certification",
            type:"text"
         
         },

       
      ]
   }, 
   {
      "code":"UPAC",
      "text":"Upload certificate",
      "skipFor":{
         "code":"LADC",
         "answer":[
            "FALS"
         ]
      },
      "options":[
         {
            "code":"UPLD",
            "text":"You can only upload a PDF or JPG file less than 5MB"
         },
       
      ]
   },
   {
      "code":"PRIM",
      "text":"What is your primary area of expertise",
      "options":[
         {
            "code":"RELT",
            "text":"Relationship"
         },
         {
            "code":"DEPR",
            "text":"Depression"
         },
         {
            "code":"ANXI",
            "text":"Anxiety"
         },
         {
            "code":"BURN",
            "text":"Burnout"
         },
         {
            "code":"COMM",
            "text":"Communication"
         },
         {
            "code":"EATD",
            "text":"Eating Disorder"
         },
         {
            "code":"CARR",
            "text":"Career Transition"
         },
         {
            "code":"EMOT",
            "text":"Emotional Disorder"
         },
         {
            "code":"GOAL",
            "text":"Goal Setting"
         },
         {
            "code":"SPEK",
            "text":"Public Speaking"
         },
         {
            "code":"FOCS",
            "text":"Focus"
         },
   
      ]
   },
   {
      "code":"SECO",
      "text":"Select other areas of expertise",
      "maxSelections":11,
      "options":[
         {
            "code":"RELT",
            "text":"Relationship"
         },
         {
            "code":"DEPR",
            "text":"Depression"
         },
         {
            "code":"ANXI",
            "text":"Anxiety"
         },
         {
            "code":"BURN",
            "text":"Burnout"
         },
         {
            "code":"COMM",
            "text":"Communication"
         },
         {
            "code":"EATD",
            "text":"Eating Disorder"
         },
         {
            "code":"CARR",
            "text":"Career Transition"
         },
         {
            "code":"EMOT",
            "text":"Emotional Disorder"
         },
         {
            "code":"GOAL",
            "text":"Goal Setting"
         },
         {
            "code":"SPEK",
            "text":"Public Speaking"
         },
         {
            "code":"FOCS",
            "text":"Focus"
         },
   
      ]
   },
  
    {
       "code":"PLAY",
       "text":"What sport(s) do you specialize in?",
   
       "maxSelections":12,
       "options":[
          {
             "code":"BASK",
             "text":"Basketball"
          },
          {
             "code":"SOCR",
             "text":"Soccer"
          },
          {
             "code":"BASB",
             "text":"Baseball"
          },
          {
             "code":"ICEH",
             "text":"Ice hockey"
          },
          {
             "code":"GOLF",
             "text":"Golf"
          },
          {
             "code":"TENS",
             "text":"Tennis"
          },
          {
             "code":"FOTB",
             "text":"Football"
          },
          {
             "code":"VOLY",
             "text":"Volleyball"
          },
          {
             "code":"BOXN",
             "text":"Boxing"
          },
          {
             "code":"MOTR",
             "text":"Motorsports"
          },
          {
             "code":"TRACK",
             "text":"Track & Field"
          },
          {
             "code":"FITN",
             "text":"Fitness & Body"
          },
   
       ]
    },
    {
       "code":"LEVL",
       "text":"What level of sports do you specialize in?",
 
       "maxSelections":4,
       "options":[
         {
            "code":"HIGH",
            "text":"High School"
         },
          {
             "code":"COLL",
             "text":"College"
          },
          {
             "code":"PROF",
             "text":"Professional"
          },
          {
             "code":"OTHR",
             "text":"Recreational"
          }
       ]
    },
   
   
  
 ]
 export default ProQuestions