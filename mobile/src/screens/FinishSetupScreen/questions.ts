import { IOption } from "src/components/QuestionCard"
import MaleSvg from "res/svgs/Male.svg"
import FemaleSvg from "res/svgs/Female.svg"
import NonBinarySvg from "res/svgs/NonBinary.svg"
import PreferNotSaySvg from "res/svgs/PreferNotSay.svg"
import basketball_svg from "res/svgs/basketball.svg"
import baseball_svg from "res/svgs/baseball.svg"
import boxing_svg from "res/svgs/boxing.svg"
import golf_svg from "res/svgs/golf.svg"
import ice_hockey_svg from "res/svgs/ice_hockey.svg"
import motorsports_svg from "res/svgs/motorsports.svg"
import american_football_svg from "res/svgs/american_football.svg"
import track___field_svg from "res/svgs/track___field.svg"
import soccer___football_svg from "res/svgs/soccer___football.svg"
import other_sport_svg from "res/svgs/other_sport.svg"
import tennis_svg from "res/svgs/tennis.svg"
import volleyball_svg from "res/svgs/volleyball.svg"

import pro___active_svg from "res/svgs/pro___active.svg"
import recreational_svg from "res/svgs/recreational.svg"
import pro___retired_svg from "res/svgs/pro___retired.svg"
import student_svg from "res/svgs/student.svg"
import other_svg from "res/svgs/other.svg"

import depression_svg from "res/svgs/depression.svg"
import emotional_disorder_svg from "res/svgs/emotional_disorder.svg"
import burnout_svg from "res/svgs/burnout.svg"
import focus_svg from "res/svgs/focus.svg"
import career_transition_svg from "res/svgs/career_transition.svg"
import goal_setting_svg from "res/svgs/goal_setting.svg"
import communication_svg from "res/svgs/communication.svg"
import relationship_svg from "res/svgs/relationship.svg"
import other_needs_svg from "res/svgs/other_needs.svg"
import public_speaking_svg from "res/svgs/public_speaking.svg"
import eating_disorder_svg from "res/svgs/eating_disorder.svg"
import anxiety_svg from "res/svgs/anxiety.svg"

import over_a_year_ago_svg from "res/svgs/over_a_year_ago.svg"
import more_than_5_years_svg from "res/svgs/more_than_5_years.svg"
import never_svg from "res/svgs/never.svg"
import recently_svg from "res/svgs/recently.svg"
import cloud from "src/cloud"
import types from "res/refGlobalTypes"
import questionMap from "res/svgs/questionMap"

const _questions:{[key:string]:Array<IOption>}={ 

    "GENDER":[
        {code:"MALE",icon:MaleSvg  },
        {code:"FEM",icon:FemaleSvg  },
        {code:"NONB",icon:NonBinarySvg  },
        {code:"PNS",icon: PreferNotSaySvg }
        ],
    "EXER":[
        {code:"5-7"},
        {code:"1-2"},
        {code:"1MONTH"},
        {code:"1WHILE"}
    ],
    "PLAY":[
        {code:"YES"},
        {code:"NO"}
    ],
    "WHATPLAY" : [    
        { code: "BASKETB", icon: basketball_svg } ,
        { code: "SOCCER", icon: soccer___football_svg } ,
        { code: "BASEBALL", icon: baseball_svg } ,
        { code: "ICE", icon: ice_hockey_svg } ,
        { code: "GOLF", icon: golf_svg } ,
        { code: "TENNIS", icon: tennis_svg } ,
        { code: "FOOTBAL", icon: american_football_svg } ,
        { code: "VOLLEY", icon: volleyball_svg } ,
        { code: "BOXING", icon: boxing_svg } ,
        { code: "MOTORSP", icon: motorsports_svg } ,
        { code: "TRACK", icon: track___field_svg } ,
        { code: "OTHER", icon: other_sport_svg , otherButton:true } ,
        {code:"ARCHERY",partOfOtherOption:true},
        {code:"BADMINT",partOfOtherOption:true},
        {code:"BEACH",partOfOtherOption:true},
        {code:"BOWL",partOfOtherOption:true},
        {code:"CRICKET",partOfOtherOption:true},
        {code:"CYCLE",partOfOtherOption:true},
        {code:"FIELD",partOfOtherOption:true},
        {code:"HANDBALL",partOfOtherOption:true},
        {code:"RUGBY",partOfOtherOption:true},
        {code:"SWIM",partOfOtherOption:true},
        {code:"OTHER",partOfOtherOption:true},
         ],

    "HIGHEST" : [    
        { code: "STUD", icon: student_svg },
        { code: "PROACT", icon: pro___active_svg } ,
        { code: "PRORET", icon: pro___retired_svg } ,
        { code: "RECREAT", icon: recreational_svg } ,
        { code: "OTHER", icon: other_svg } 
        ],

    "HELPYOU" : [    
          { code: "RELATION", icon: relationship_svg } ,
          { code: "DEPRESS", icon: depression_svg } ,
          { code: "ANXIET", icon: anxiety_svg } ,
          { code: "BURNOUT", icon: burnout_svg } ,
          { code: "COMMUNIT", icon: communication_svg } ,
          { code: "EATING ", icon: eating_disorder_svg } ,
          { code: "CAREER", icon: career_transition_svg } ,
          { code: "EMOTION", icon: emotional_disorder_svg } ,
          { code: "GOAL", icon: goal_setting_svg } ,
          { code: "PUBLIC", icon: public_speaking_svg } ,
          { code: "FOCUS", icon: focus_svg } ,
          { code: "OTHER", icon: other_needs_svg ,otherButton:true} ,
          {code: "WHAT OTHER",partOfOtherOption:true,multiline:true,IsOpenEndedQuestion:true,placeholderText:"Need(s)"}
           ],
           
    "PROGENDER":[
        {code:"MALE",icon:MaleSvg  },
        {code:"FEMALE",icon:FemaleSvg  },
        {code:"NONB",icon:NonBinarySvg  },
        {code:"PNS",icon: PreferNotSaySvg }
        ],

    "SUCIDAL" : [    
          { code: "RECENT", icon: recently_svg,otherButton:true } ,
          { code: "YEARSAGO", icon: over_a_year_ago_svg } ,
          { code: "M5", icon: more_than_5_years_svg } ,
          { code: "NVR", icon: never_svg } ,
          {code: "HOWRECENT",partOfOtherOption:true,IsOpenEndedQuestion:true,placeholderText:"How many days ago?",keybordType:"numeric"},
          { code:"HOSPITALIZED", question:{ question:"Have you been hospitalized or under the care of a doctor?",options:["Yes","No"]},partOfOtherOption:true} 
         ],

}
const questions:{[key:string]:Array<IOption>}={}
const remoteQuestions:[code: string, question: string, options: [code: string, label: string][], answer?: string | undefined][]=[]
export async function translateQuestions() {
    return;
    Object.keys(questions).forEach(x=>delete questions[x])
    Object.assign(questions,_questions)

    Object.assign(remoteQuestions,await cloud.getUserQuestions())

    let translated: any = {}
    Object.keys(questions).forEach(k => {

        let details = remoteQuestions.find(x => x[0] == k)
        if (details) {

            let opts = questions[k]
            opts.forEach(o => {
                let od = details[2].find(l => o.text == l[0])
                if (od && o.text)
                    o.text = od[1]
            })
            translated[details[1]] = opts
        }
        delete questions[k]

    })
    Object.assign(questions,translated)
    
}
export function fillDetail(questionText:string, options:{[key:string]:{checked?:boolean,text?:string }},outForm:any){

   let remoteQuestion= remoteQuestions.find(([_,text])=>{
        return text==questionText
    })

    if (remoteQuestion){
        delete outForm[remoteQuestion![0]]
        Object.keys(options).forEach(o=>{

            if (options[o].checked){
                
                 let optionCode=remoteQuestion?.[2].find(([code,label])=>{
                   return  label==o
                 })?.[0]
                 outForm[remoteQuestion![0]]=optionCode
            }else if (options[o].text){
                outForm[remoteQuestion![0]]=options[o].text
            }

        })
    }


}

export type IQuestionWithIcon=types.IQuestion & { icon?:any ,selectedIcon?:any}
export async function loadQuestions():Promise<Array<IQuestionWithIcon>>{

    let questions=await cloud.getUserQuestions();
    questions.forEach(question=>{

        question.options=question.options.map(o=>{

            let icon:any=questionMap[question.code][o.code]
            let selectedIcon:any=questionMap[question.code][o.code+"1"]
            if (icon)
            return {...o,icon,selectedIcon}

            return o
        })
    })
    return questions

}
export default questions