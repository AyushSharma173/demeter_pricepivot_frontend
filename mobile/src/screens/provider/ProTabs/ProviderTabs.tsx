import { ITabSpecs } from "core/navhelper"
import menu_unselected_svg from "res/svgs/menu_unselected.svg"
import menu_selected_svg from "res/svgs/menu_selected.svg"
import chat_selected_svg from "res/svgs/chat_selected.svg"
import chat_unselected_svg from "res/svgs/chat_unselected.svg"
import home_selected_svg from "res/svgs/home_selected.svg"
import home_unselected_svg from "res/svgs/home_unselected.svg"
import appointments_selected_svg from "res/svgs/appointments_selected.svg"
import appointments_unselected_svg from "res/svgs/appointments_unselected.svg"

const ProviderTabs:ITabSpecs=[
    {
      name:"ProHome",
      label:"Home",
      selected:home_selected_svg,
      unselected:home_unselected_svg
    },
    {
      name:"ProAppointments",
      label:"Appointments",
      selected:appointments_selected_svg,
      unselected:appointments_unselected_svg
    },
    {
      name:"ProChat",
      label:"Chat",
      selected:chat_selected_svg,
      unselected:chat_unselected_svg
    },
    {
      name:"ProMenu",
      label:"Menu",
      selected:menu_selected_svg,
      unselected:menu_unselected_svg
    }
]

export default ProviderTabs