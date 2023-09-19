import types from "../commons/refGlobalTypes"

const questions:
types.IQuestions=[
   {
       code: "GEND",
       text: "What is your gender identity?",
       options: [
           {
               code: "MALE",
               text: "Male"
           },
           {
               code: "FEMA",
               text: "Female"
           },
           {
               code: "NONB",
               text: "Non-Binary"
           },
           {
               code: "PNS0",
               text: "Prefer not to say"
           }
       ]
   },
//    {
//        code: "EXER",
//        text: "How often do you participate in physical activites?",
//        options: [
//            {
//                code: "1TO3",
//                text: "1-3 times a week"
//            },
//            {
//                code: "4TO7",
//                text: "4-7 times a week"
//            },
//            {
//                code: "2MON",
//                text: "Twice a month"
//            },
//            {
//                code: "OWHI",
//                text: "Once in a while "
//            }
//        ]
//    },
   {
      code:"HOFT",
      text:"How often do you participate in sports or physical activities?",
      options:[
         {
            code:"REGU",
            text:"Regularly"
         },
         {
            code:"RECT",
            text:"Occasionally"
         },
         {
            code:"NOTM",
            text:"Not any more"
         },
         {
            code:"NEVR",
            text:"Never"
         }
      ]
   },
   {
       code: "PLAY",
       text: "What sport(s) do you play?",
       pastText:"What sport(s) did you play?",
       usePastFor:{ code: "HOFT" , answer:["NOTM"]},
       skipFor   :{ code :"HOFT",answer:["NEVR"]},
       maxSelections:5,
       options: [
           {
               code: "BASK",
               text: "Basketball"
           },
           {
               code: "SOCR",
               text: "Soccer"
           },
           {
               code: "BASB",
               text: "Baseball"
           },
           {
               code: "ICEH",
               text: "Ice hockey"
           },
           {
               code: "GOLF",
               text: "Golf"
           },
           {
               code: "TENS",
               text: "Tennis"
           },
           {
               code: "FOTB",
               text: "Football"
           },
           {
               code: "VOLY",
               text: "Volleyball"
           },
           {
               code: "BOXN",
               text: "Boxing"
           },
           {
               code: "MOTR",
               text: "Motorsports"
           },
           {
               code: "TRACK",
               text: "Track & Field"
           },
           {
               code:"FITN",
               text:"Fitness & Body"
           },
           {
               code: "OTHR",
               text: "Additional Sport",
               otherText:"Additional sport(s) if not listed"
           },
       ]
   },
   {
       code: "LEVL",
       text: "What is the highest level of sports you have played?",
       pastText: "What was the highest level of sports you have played?",  
       usePastFor:{ code: "HOFT" , answer:["NOTM"]},
       skipFor   :{ code :"HOFT",answer:["NEVR"]},    
       options: [
           {
               code: "HIGH",
               text: "High School"
           },
           {
            code: "COLL",
            text: "College"
            },
           {
               code: "PROF",
               text: "Professional"
           },
           {
               code: "OTHR",
               text: "Recreational"
           },
       ]
   },
   {
      code:"YNOT",
      text:"Why do you not play sports anymore?",
      skipFor   :{ code :"HOFT",answer:["REGU","RECT","NEVR"]},
      options: [
       { code:"RTRD",
         text:"Retired"

      },
      {
         code:"HLTI",
         text:"Health & Injury"
      },
      {
         code:"CSWT",
         text:"Career Switch"
      },
      {
         code: "OTHR",
         text: "Other",
         otherText:"Other reasons you do not play sports anymore?"
     },


   ]

   },
   {
       code: "HELP",
       text: "How can we help?",
       maxSelections:5,
       options: [
           {
               code: "RELT",
               text: "Relationship"
           },
           {
               code: "DEPR",
               text: "Depression"
           },
           {
               code: "ANXI",
               text: "Anxiety"
           },
           {
               code: "BURN",
               text: "Burnout"
           },
           {
               code: "COMM",
               text: "Communication"
           },
           {
               code: "EATD",
               text: "Eating Disorder"
           },
           {
               code: "CARR",
               text: "Career Transition"
           },
           {
               code: "EMOT",
               text: "Emotional Disorder"
           },
           {
               code: "GOAL",
               text: "Goal Setting"
           },
           {
               code: "SPEK",
               text: "Public Speaking"
           },
           {
               code: "FOCS",
               text: "Focus"
           },
           {
               code: "OTHR",
               text: "Additional Need",
               otherText:"Additional need(s) if not listed"
           }
       ]
   },
   {
       code: "PROG",
       text: "Mental health professional preference",
       options: [
         {
            code: "MALE",
            text: "Male"
        },
        {
            code: "FEMA",
            text: "Female"
        },
        {
            code: "NONB",
            text: "Non-Binary"
        },
        {
            code: "PNS0",
            text: "No Preference"
        }
       ]
   },
 
]
export default questions
