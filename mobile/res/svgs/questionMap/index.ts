import EXER_1TO3 from "./EXER/1TO3.svg"
import EXER_2MON from "./EXER/2MON.svg"
import EXER_4TO7 from "./EXER/4TO7.svg"
import EXER_OWHI from "./EXER/OWHI.svg"
import GEND_FEMA from "./GEND/FEMA.svg"
import GEND_MALE from "./GEND/MALE.svg"
import GEND_NONB from "./GEND/NONB.svg"
import GEND_PNS0 from "./GEND/PNS0.svg"
import HELP_ANXI from "./HELP/ANXI.svg"
import HELP_BURN from "./HELP/BURN.svg"
import HELP_CARR from "./HELP/CARR.svg"
import HELP_COMM from "./HELP/COMM.svg"
import HELP_DEPR from "./HELP/DEPR.svg"
import HELP_EATD from "./HELP/EATD.svg"
import HELP_EMOT from "./HELP/EMOT.svg"
import HELP_FOCS from "./HELP/FOCS.svg"
import HELP_GOAL from "./HELP/GOAL.svg"
import HELP_OTHR from "./HELP/OTHR.svg"
import HELP_RELT from "./HELP/RELT.svg"
import HELP_SPEK from "./HELP/SPEK.svg"
import HOFT_NEVR from "./HOFT/NEVR.svg"
import HOFT_NOTM from "./HOFT/NOTM.svg"
import HOFT_RECT from "./HOFT/RECT.svg"
import HOFT_REGU from "./HOFT/REGU.svg"
import HOFT_REGU1 from "./HOFT/REGU1.svg"
import LEVL_OTHR from "./LEVL/OTHR.svg"
import LEVL_PROF from "./LEVL/PROF.svg"
import LEVL_STUD from "./LEVL/STUD.svg"
import LEVL_COLE from "./LEVL/COLE.svg"
import PLAY_BASEB from "./PLAY/BASEB.svg"
import PLAY_BASK from "./PLAY/BASK.svg"
import PLAY_BOXN from "./PLAY/BOXN.svg"
import PLAY_FITN from "./PLAY/FITN.svg"
import PLAY_FOTB from "./PLAY/FOTB.svg"
import PLAY_GOLF from "./PLAY/GOLF.svg"
import PLAY_ICEH from "./PLAY/ICEH.svg"
import PLAY_MOTR from "./PLAY/MOTR.svg"
import PLAY_OTHR from "./PLAY/OTHR.svg"
import PLAY_SOCR from "./PLAY/SOCR.svg"
import PLAY_TENS from "./PLAY/TENS.svg"
import PLAY_TRACK from "./PLAY/TRACK.svg"
import PLAY_VOLY from "./PLAY/VOLY.svg"
import PROG_FEMA from "./PROG/FEMA.svg"
import PROG_MALE from "./PROG/MALE.svg"
import PROG_NONB from "./PROG/NONB.svg"
import PROG_PNS0 from "./PROG/PNS0.svg"
import YNOT_CSWT from "./YNOT/CSWT.svg"
import YNOT_HLI from "./YNOT/HLI.svg"
import YNOT_OTHR from "./YNOT/OTHR.svg"
import YNOT_RTRD from "./YNOT/RTRD.svg"
const questionMap:any={
    "EXER": {
        "1TO3": EXER_1TO3,
        "2MON": EXER_2MON,
        "4TO7": EXER_4TO7,
        "OWHI": EXER_OWHI
    },
    "GEND": {
        "FEMA": GEND_FEMA,
        "MALE": GEND_MALE,
        "NONB": GEND_NONB,
        "PNS0": GEND_PNS0
    },
    "HELP": {
        "ANXI": HELP_ANXI,
        "BURN": HELP_BURN,
        "CARR": HELP_CARR,
        "COMM": HELP_COMM,
        "DEPR": HELP_DEPR,
        "EATD": HELP_EATD,
        "EMOT": HELP_EMOT,
        "FOCS": HELP_FOCS,
        "GOAL": HELP_GOAL,
        "OTHR": HELP_OTHR,
        "RELT": HELP_RELT,
        "SPEK": HELP_SPEK
    },
    "HOFT": {
        "NEVR": HOFT_NEVR,
        "NOTM": HOFT_NOTM,
        "RECT": HOFT_RECT,
        "REGU": HOFT_REGU,
        "REGU1":HOFT_REGU1
    },

    "LEVL": {
        "OTHR": LEVL_OTHR,
        "PROF": LEVL_PROF,
        "STUD": LEVL_STUD,
        "HIGH": LEVL_STUD,
        "COLL":LEVL_COLE,
    },
    "PLAY": {
        "BASB": PLAY_BASEB,
        "BASK": PLAY_BASK,
        "BOXN": PLAY_BOXN,
        "FITN": PLAY_FITN,
        "FOTB": PLAY_FOTB,
        "GOLF": PLAY_GOLF,
        "ICEH": PLAY_ICEH,
        "MOTR": PLAY_MOTR,
        "OTHR": PLAY_OTHR,
        "SOCR": PLAY_SOCR,
        "TENS": PLAY_TENS,
        "TRACK": PLAY_TRACK,
        "VOLY": PLAY_VOLY
    },
    "PROG": {
        "FEMA": PROG_FEMA,
        "MALE": PROG_MALE,
        "NONB": PROG_NONB,
        "PNS0": PROG_PNS0
    },
    "YNOT": {
        "CSWT": YNOT_CSWT,
        "HLTI": YNOT_HLI,
        "OTHR": YNOT_OTHR,
        "RTRD": YNOT_RTRD
    },
    "SECO": {
        "ANXI": HELP_ANXI,
        "BURN": HELP_BURN,
        "CARR": HELP_CARR,
        "COMM": HELP_COMM,
        "DEPR": HELP_DEPR,
        "EATD": HELP_EATD,
        "EMOT": HELP_EMOT,
        "FOCS": HELP_FOCS,
        "GOAL": HELP_GOAL,
        "OTHR": HELP_OTHR,
        "RELT": HELP_RELT,
        "SPEK": HELP_SPEK
    },
    "PRIM": {
        "ANXI": HELP_ANXI,
        "BURN": HELP_BURN,
        "CARR": HELP_CARR,
        "COMM": HELP_COMM,
        "DEPR": HELP_DEPR,
        "EATD": HELP_EATD,
        "EMOT": HELP_EMOT,
        "FOCS": HELP_FOCS,
        "GOAL": HELP_GOAL,
        "OTHR": HELP_OTHR,
        "RELT": HELP_RELT,
        "SPEK": HELP_SPEK
    },
}
export default questionMap