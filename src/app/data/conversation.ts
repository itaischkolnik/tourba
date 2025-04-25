export interface ConversationStep {
  id: number;
  message: string;
  buttons?: string[];
  inputType?: 'text' | 'number' | 'email' | 'tel' | 'radio' | 'select' | 'time' | 'date' | 'checkbox';
  condition?: {
    field: string | string[];
    value: string | string[] | { [key: string]: string | string[] };
    type?: 'OR' | 'AND' | 'includes';
  };
  gif?: string;
  validation?: (value: string) => boolean;
  placeholder?: string;
  isSection?: boolean;
  required?: boolean;
  isIntro?: boolean;
  isTransitioning?: boolean;
  sectionQuestions?: {
    id: number;
    message: string;
    inputType: 'text' | 'number' | 'email' | 'tel' | 'checkbox' | 'select' | 'radio' | 'time' | 'date';
    required: boolean;
    validation?: (value: string) => boolean;
    options?: string[];
    placeholder?: string;
    condition?: {
      field: string | string[];
      value: string | string[] | { [key: string]: string | string[] };
      type?: 'OR' | 'AND' | 'includes';
    };
  }[];
  options?: string[];
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^05\d{8}$/;

export const conversationSteps: ConversationStep[] = [
  {
    id: 1,
    message: `היי, אני **גיל** מצוות **תּוּר בָּה** 😊

אנחנו מתמחים בבנייה והפקה של ימי תוכן, סיורים ופעילויות חווייתיות שמחברות בין אנשים, הטבע והמורשת של ארץ-ישראל – תוך תשומת לב לכל פרט ושירות אישי לאורך כל הדרך.

עם ניסיון משולב של 25 שנות תכנון ופיקוד בצה״ל, הדרכת טיולים, ייעוץ חינוכי והובלת מאות קבוצות מרוצות, אנחנו הופכים כל רעיון למסלול מושלם שמותאם בדיוק לצרכים, לאופי ולהעדפות של הקבוצה שלך.

כדי לעזור לנו לבנות עבורכם את החוויה המדויקת ביותר, נשמח שתענו על כמה שאלות קצרות.

**מכאן נמשיך ללוות אתכם באופן אישי עד ליום הפעילות – החל מתכנון מוקפד, דרך תיאום ספקים ועד משוב וסיכום לאחר החוויה.**`,
    gif: '/images/intro.jpg',
    buttons: ['בואו נצא לדרך!'],
    isIntro: true
  },
  {
    id: 2,
    message: `**פרטי איש קשר**

מלא/י כאן את פרטי הקשר של נציג/ת הקבוצה כדי שנוכל לחזור אליך במהירות.`,
    isSection: true,
    sectionQuestions: [
      {
        id: 1,
        message: 'שם פרטי',
        inputType: 'text',
        required: true
      },
      {
        id: 2,
        message: 'שם משפחה',
        inputType: 'text',
        required: true
      },
      {
        id: 3,
        message: 'מספר טלפון נייד',
        inputType: 'tel',
        required: true,
        validation: (value: string) => phoneRegex.test(value)
      },
      {
        id: 4,
        message: 'כתובת דוא״ל',
        inputType: 'email',
        required: true,
        validation: (value: string) => emailRegex.test(value)
      },
      {
        id: 5,
        message: 'שם היישוב / האזור',
        inputType: 'text',
        required: true
      },
      {
        id: 6,
        message: 'הגדרת התפקיד שלך עבור הקבוצה',
        inputType: 'text',
        required: true
      }
    ]
  },
  {
    id: 3,
    message: `**פרטי הקבוצה**

ספר/י לנו על הרכב הקבוצה וגודלה — כך נתאים את המסלול והקצב הנכון עבורכם.`,
    isSection: true,
    sectionQuestions: [
      {
        id: 7,
        message: 'שם הקבוצה',
        inputType: 'text',
        required: true
      },
      {
        id: 8,
        message: 'סוג הקבוצה',
        inputType: 'checkbox',
        required: true,
        options: [
          'משפחה',
          'חברים',
          'קהילה דתית',
          'גרעין תורני',
          'מקום עבודה פרטי',
          'ועד עובדים ציבורי',
          'רשות מקומית',
          'תלמידים',
          'צוות חינוכי',
          'אחר'
        ]
      },
      {
        id: 9,
        message: 'אפיון הקבוצה',
        inputType: 'checkbox',
        required: true,
        options: [
          'משפחות',
          'תלמידים',
          'צעירים וצעירות',
          'מיטיבי לכת',
          'נוער מיטיבי לכת',
          'גמלאים מיטיבי לכת',
          'מבוגרים בגיל 25-50',
          'מבוגרים בגיל 50-70',
          'גמלאים',
          'הגיל השלישי',
          'חיילים',
          'אקדמאים וחוקרים',
          'טיול נשים',
          'קבוצה דתית',
          'קבוצה חרדית',
          'תיירות חוץ',
          'אחר'
        ]
      },
      {
        id: 10,
        message: 'מספר המשתתפים',
        inputType: 'select',
        required: true,
        options: [
          '10-15',
          '15-20',
          '20-30',
          '30-40',
          '40-50',
          '45-55',
          '50-60',
          '60-70',
          '70-80',
          '80-100',
          '100-110',
          '110-120',
          '120 ומעלה',
          '180 ומעלה',
          '250 ומעלה',
          '300 ומעלה',
          'אחר'
        ]
      },
      {
        id: 11,
        message: 'האם יש צורכי נגישות בקבוצה',
        inputType: 'radio',
        required: true,
        options: [
          'כן',
          'לא',
          'אחר'
        ]
      }
    ]
  },
  {
    id: 4,
    message: "פרטי הפעילות\n\nכעת נרד לפרטים הראשונים של הפעילות עצמה: מועד, סוג והגעה.",
    isSection: true,
    sectionQuestions: [
      {
        id: 12,
        message: "סוג הפעילות המבוקשת *",
        inputType: "radio",
        options: [
          "סיור עד 3 שעות",
          "טיול חד-יומי",
          "טיול רב-יומי",
          "סופ״ש",
          "אחר"
        ],
        required: true
      },
      {
        id: 13,
        message: "תאריך/ים מבוקשים *\n\n_לא חובה לבחור תאריך מדויק—ניתן להזין טווח או חודש_",
        inputType: "date",
        required: true
      },
      {
        id: 14,
        message: "האם תצאו בהסעה מאורגנת? *",
        inputType: "radio",
        options: [
          "כן",
          "לא, המשתתפים מגיעים עצמאית",
          "אחר"
        ],
        required: true
      },
      {
        id: 15,
        message: "שעת היציאה הריאלית",
        inputType: "time",
        required: true,
        condition: {
          field: "4_14",
          value: "כן"
        }
      },
      {
        id: 16,
        message: "נקודת היציאה *",
        inputType: "text",
        placeholder: "שם היישוב",
        required: true,
        condition: {
          field: "4_14",
          value: "כן"
        }
      },
      {
        id: 17,
        message: "נקודת החזרה *",
        inputType: "text",
        placeholder: "שם היישוב",
        required: true,
        condition: {
          field: "4_14",
          value: "כן"
        }
      },
      {
        id: 18,
        message: "שעת ההתכנסות לתחילת הפעילות",
        inputType: "time",
        required: true,
        condition: {
          field: "4_14",
          value: ["לא, המשתתפים מגיעים עצמאית", "אחר"]
        }
      },
      {
        id: 19,
        message: "שעת סיום מקסימלית בשטח",
        inputType: "time",
        required: false
      }
    ]
  },
  {
    id: 5,
    message: "**מאפייני הטיול**\n\nאיזה סגנון טיול ותוכן הכי יעניינו אתכם? סמנו כל מה שמתאים.",
    isSection: true,
    sectionQuestions: [
      {
        id: 23,
        message: "סוג הטיול המבוקש *",
        inputType: "checkbox",
        required: true,
        options: [
          "טיול מים",
          "טיול הליכה",
          "טיול עירוני",
          "טיול טבע",
          "טיול פריחה",
          "טיול היסטורי",
          "טיול גאולוגי",
          "טיולי יין",
          "טיולי שווקים ואוכל",
          "טיול תרבותי-אומנותי",
          "סיור סליחות",
          "סיור חנוכיות",
          "טיול בר מצווה",
          "טיול בת מצווה",
          "סיור בשכונות חרדיות",
          "טיול עדות ודתות",
          "סיור גרפיטי",
          "אחר"
        ]
      },
      {
        id: 24,
        message: "סוג התוכן המבוקש *",
        inputType: "checkbox",
        required: true,
        options: [
          "התיישבות וציונות",
          "יהדות",
          "נצרות",
          "איסלאם",
          "מורשת קרב",
          "ארכיאולוגיה",
          "בעקבות התנ״ך",
          "היסטוריה",
          "טבע אדם ונוף",
          "בוטניקה",
          "זואולוגיה",
          "אומנות ואדריכלות",
          "איכות הסביבה",
          "תצפית",
          "תולדות המדינה",
          "גאולוגיה",
          "אחר"
        ]
      },
      {
        id: 25,
        message: "רמת קושי *",
        inputType: "radio",
        required: true,
        options: [
          "קלה",
          "קלה-בינונית",
          "בינונית",
          "בינונית-מאתגרת",
          "מיטיבי לכת",
          "אחר"
        ]
      },
      {
        id: 26,
        message: "אורך המסלול *",
        inputType: "radio",
        required: true,
        options: [
          "עד 0.5 ק״מ",
          "עד 1 ק״מ",
          "עד 1.5 ק״מ",
          "עד 2 ק״מ",
          "עד 3 ק״מ",
          "עד 4 ק״מ",
          "עד 5 ק״מ",
          "עד 6 ק״מ",
          "עד 8 ק״מ",
          "מעל 8 ק״מ",
          "אחר"
        ]
      },
      {
        id: 27,
        message: "מהו האזור/ים האפשריים שתרצו לטייל בהם? *",
        inputType: "checkbox",
        required: true,
        options: [
          "חרמון",
          "צפון רמת הגולן (עין זיוון וצפונה עד החרמון)",
          "מרכז רמת הגולן (אזור קצרין והסביבה)",
          "דרום רמת הגולן (מגמלא דרומה לצמח)",
          "גליל עליון מרכזי (מראש פינה עד מטולה)",
          "גליל עליון מזרחי (צפת, מירון והסביבה)",
          "גליל תחתון",
          "עמק יזרעאל",
          "שומרון",
          "צפון בקעת הירדן",
          "כרמל ורמות מנשה",
          "שרון",
          "מישור החוף",
          "שפלת יהודה",
          "הרי ירושלים",
          "הרי חברון",
          "גוש עציון",
          "צפון הנגב",
          "מרכז הנגב ומכתשים",
          "דרום הנגב",
          "ים המלח",
          "הערבה",
          "הרי אילת ואילת"
        ]
      },
      {
        id: 28,
        message: "האזור/ים האפשריים לטיול הרב-יומי *",
        inputType: "select",
        required: true,
        options: [
          "צפון הגולן",
          "דרום הגולן",
          "הגליל העליון",
          "הגליל התחתון",
          "הכרמל",
          "עמק יזרעאל",
          "השרון",
          "מישור החוף",
          "ירושלים",
          "יהודה",
          "שומרון",
          "מדבר יהודה",
          "שפלת יהודה",
          "הנגב הצפוני",
          "הנגב המערבי",
          "מכתש רמון",
          "הערבה",
          "אילת",
          "אחר"
        ],
        condition: {
          field: "4_12",
          value: ["טיול רב-יומי", "סופ״ש"]
        }
      }
    ]
  },
  {
    id: 6,
    message: "**שירותים ואטרקציות**\n\nסמנו אילו שירותי הפקה נוספים ואטרקציות תרצו שנארגן עבורכם.",
    isSection: true,
    sectionQuestions: [
      {
        id: 24,
        message: "אילו שירותים תבקשו מתּוּר בָּה? *",
        inputType: "checkbox",
        required: true,
        options: [
          "תכנון הפעילות",
          "הדרכה ברמה גבוהה",
          "הדרכה ברמה רגילה",
          "תיאום ותשלום לאתרים ולאטרקציות",
          "תיאום והזמנת הסעה",
          "תיאום הזמנה ותשלום למסעדה/קייטרינג",
          "תיאום הזמנה ותשלום למלון/אכסניה",
          "שירותי הפקה פרימיום",
          "אחר"
        ]
      },
      {
        id: 25,
        message: "שעה להתייצבות ההסעה *",
        inputType: "time",
        required: true,
        condition: {
          field: "6_24",
          value: "תיאום והזמנת הסעה"
        }
      },
      {
        id: 26,
        message: "שעה מקסימלית לשחרור ההסעה *",
        inputType: "time",
        required: true,
        condition: {
          field: "6_24",
          value: "תיאום והזמנת הסעה"
        }
      },
      {
        id: 27,
        message: "איזו אטרקציה תרצו לשלב?",
        inputType: "checkbox",
        required: false,
        options: [
          "סדנת יצירה",
          "סדנת בישול",
          "סדנת יין",
          "סדנת שוקולד",
          "הופעה מוזיקלית",
          "מופע אומנותי",
          "פעילות ODT",
          "פעילות גיבוש",
          "סדנת צילום",
          "סיור קולינרי",
          "טעימות יין",
          "אחר"
        ]
      },
      {
        id: 28,
        message: "איזה סוג אוכל תבקשו לשלב? *",
        inputType: "checkbox",
        required: true,
        options: [
          "ארוחת בוקר",
          "ארוחת צהריים",
          "ארוחת ערב",
          "קפה ועוגה",
          "כיבוד קל",
          "פיקניק",
          "ארוחת שף",
          "אחר"
        ],
        condition: {
          field: "6_24",
          value: "תיאום הזמנה ותשלום למסעדה/קייטרינג"
        }
      },
      {
        id: 29,
        message: "מהי רמת הכשרות שאתם מבקשים? *",
        inputType: "radio",
        required: true,
        options: [
          "ללא כשרות",
          "כשר",
          "כשר למהדרין",
          "בד״ץ",
          "אחר"
        ],
        condition: {
          field: "6_24",
          value: "תיאום הזמנה ותשלום למסעדה/קייטרינג"
        }
      },
      {
        id: 30,
        message: "האם נדרש חדר אוכל נפרד לקבוצה? *",
        inputType: "radio",
        required: true,
        options: [
          "כן",
          "לא",
          "אחר"
        ],
        condition: {
          field: "6_24",
          value: "תיאום הזמנה ותשלום למסעדה/קייטרינג"
        }
      },
      {
        id: 31,
        message: "מהו המחיר שלא תרצו לעבור לסועד? *",
        inputType: "select",
        required: true,
        options: [
          "עד 50 ₪",
          "עד 75 ₪",
          "עד 100 ₪",
          "עד 125 ₪",
          "עד 150 ₪",
          "עד 175 ₪",
          "עד 200 ₪",
          "עד 225 ₪",
          "עד 250 ₪",
          "עד 275 ₪",
          "עד 300 ₪",
          "עד 325 ₪",
          "עד 350 ₪",
          "אחר"
        ],
        condition: {
          field: "6_24",
          value: "תיאום הזמנה ותשלום למסעדה/קייטרינג"
        }
      }
    ]
  },
  {
    id: 7,
    message: "**לינה**\n\nלמי שמתכנן טיול רב-יומי או צריך לינה — בואו נבין מה מתאים לכם.",
    isSection: true,
    condition: {
      field: ["4_12", "6_24"],
      value: {
        "4_12": ["טיול רב-יומי", "סופ״ש"],
        "6_24": ["תיאום הזמנה ותשלום למלון/אכסניה"]
      },
      type: "OR"
    },
    sectionQuestions: [
      {
        id: 32,
        message: "האם תרצו שנבדוק מלונות מתאימים? *",
        inputType: "radio",
        required: true,
        options: [
          "כן",
          "לא",
          "אחר"
        ]
      },
      {
        id: 33,
        message: "מספר חדרים מינימלי *",
        inputType: "text",
        required: true,
        condition: {
          field: "7_32",
          value: "כן"
        }
      },
      {
        id: 34,
        message: "מספר חדרים מקסימלי *",
        inputType: "text",
        required: true,
        condition: {
          field: "7_32",
          value: "כן"
        }
      },
      {
        id: 35,
        message: "יישוב/עיר רצויה *",
        inputType: "select",
        required: true,
        options: [
          "ירושלים",
          "תל אביב",
          "חיפה",
          "אילת",
          "טבריה",
          "נתניה",
          "הרצליה",
          "אשקלון",
          "ים המלח",
          "נצרת",
          "עכו",
          "צפת",
          "מצפה רמון",
          "אחר"
        ],
        condition: {
          field: "7_32",
          value: "כן"
        }
      },
      {
        id: 36,
        message: "סוג המלון *",
        inputType: "checkbox",
        required: true,
        options: [
          "מלון עירוני",
          "מלון נופש",
          "מלון בוטיק",
          "מלון ספא",
          "צימר",
          "אכסניה",
          "בית הארחה",
          "אחר"
        ],
        condition: {
          field: "7_32",
          value: "כן"
        }
      },
      {
        id: 37,
        message: "רמת מלון (כוכבים) *",
        inputType: "radio",
        required: true,
        options: [
          "3 כוכבים",
          "4 כוכבים",
          "5 כוכבים",
          "אחר"
        ],
        condition: {
          field: "7_32",
          value: "כן"
        }
      },
      {
        id: 38,
        message: "מספר חדרים מונגשים",
        inputType: "text",
        required: false,
        condition: {
          field: ["3_11", "3_9"],
          value: {
            "3_11": ["כן"],
            "3_9": ["גמלאים", "הגיל השלישי"]
          },
          type: "OR"
        }
      },
      {
        id: 39,
        message: "רמת הכשרות המינימלית *",
        inputType: "radio",
        required: true,
        options: [
          "ללא כשרות",
          "כשר",
          "מהדרין",
          "בד״ץ",
          "אחר"
        ]
      },
      {
        id: 40,
        message: "היקף אירוח *",
        inputType: "radio",
        required: true,
        options: [
          "לינה בלבד",
          "לינה וארוחת בוקר",
          "חצי פנסיון",
          "פנסיון מלא",
          "אחר"
        ]
      },
      {
        id: 41,
        message: "האם יש צורך בהגשה לשולחנות? *",
        inputType: "radio",
        required: true,
        options: [
          "כן",
          "לא",
          "אחר"
        ]
      },
      {
        id: 42,
        message: "היפוך ארוחות בשבת",
        inputType: "radio",
        required: false,
        options: [
          "כן",
          "לא",
          "אחר"
        ],
        condition: {
          field: "4_13",
          value: "שבת",
          type: "includes"
        }
      },
      {
        id: 43,
        message: "האם נדרש חדר אוכל נפרד לקבוצה? *",
        inputType: "radio",
        required: true,
        options: [
          "כן",
          "לא",
          "אחר"
        ]
      },
      {
        id: 44,
        message: "האם נדרש בריכה במלון? *",
        inputType: "radio",
        required: true,
        options: [
          "כן",
          "לא",
          "אחר"
        ]
      },
      {
        id: 45,
        message: "האם חייב חדר כושר במלון? *",
        inputType: "radio",
        required: true,
        options: [
          "כן",
          "לא",
          "אחר"
        ]
      },
      {
        id: 46,
        message: "האם נדרש ספא במלון? *",
        inputType: "radio",
        required: true,
        options: [
          "כן",
          "לא",
          "אחר"
        ]
      },
      {
        id: 47,
        message: "האם נדרש רחצה נפרדת?",
        inputType: "radio",
        required: false,
        options: [
          "כן",
          "לא",
          "אחר"
        ],
        condition: {
          field: "7_39",
          value: "מהדרין"
        }
      }
    ]
  },
  {
    id: 8,
    message: "**תקציב וסיום**\n\nכמעט סיימנו! נשאר רק התקציב והערות אחרונות.",
    isSection: true,
    sectionQuestions: [
      {
        id: 48,
        message: "מהי המסגרת התקציבית למשתתף? *",
        inputType: "text",
        required: true,
        validation: (value: string) => !isNaN(Number(value))
      },
      {
        id: 49,
        message: "האם יש שירות או תוכן נוסף שתרצו להציע?",
        inputType: "text",
        required: false
      }
    ]
  },
  {
    id: 9,
    message: `תודה שמילאתם את הטופס!

נציג מצוות תּוּר בָּה יחזור אליכם בהקדם עם הצעה מותאמת אישית.`,
    gif: '/images/intro.jpg',
    buttons: ['התחל מחדש']
  }
]; 