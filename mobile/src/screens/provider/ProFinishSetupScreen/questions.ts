import types from "res/refGlobalTypes"
import questionMap from "res/svgs/questionMap"
import cloud from "src/cloud"



export type IQuestionWithIcon=types.IQuestion & { icon?:any ,selectedIcon?:any}
export async function loadQuestions():Promise<Array<IQuestionWithIcon>>{

   

   let questions=   await cloud.providers.getProQuestions()
    questions.forEach(question=>{

        question.options=question.options.map(o=>{
            if (!questionMap[question.code])
            return o;
            
            let icon:any=questionMap[question.code][o.code]
            let selectedIcon:any=questionMap[question.code][o.code+"1"]
            if (icon)
            return {...o,icon,selectedIcon}

            return o
        })
    })
    return questions

}
