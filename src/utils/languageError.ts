export const messages:Record<string,Record<string,string>> ={
    USER_NOT_FOUND:{
        English:"User not Found",
        Arabic:"لم يتم العثور على المستخدم",
        Turkish:"kullanıcı bulunamadı",
        Persian:"کاربر پیدا نشد",
        Armenian:"օգտվողը չի գտնվել"
    },
    PLAN_NOT_FOUND:{
        English:"plan not found",
        Arabic:"لم يتم العثور على الخطة",
        Turkish:"plan bulunamadı",
        Persian:"طرح پیدا نشد",
        Armenian:"պլանը չի գտնվել"
    },
    INVALID_CREDENTIALS:{
        English:"Invalid Cedentails",
        Arabic:"بيانات اعتماد غير صالحة",
        Turkish:"Geçersiz kimlik bilgileri",
        Persian:"اعتبارنامه نامعتبر است",
        Armenian:"Անվավեր հավատարմագրեր"
    },
    ACCOUNT_DEACTIVATED:{
        English:"Account Deactivaed",
        Arabic:"تم تعطيل الحساب",
        Turkish:"Hesap Devre Dışı Bırakıldı",
        Persian:"اکانت غیر فعال شد",
        Armenian:"Հաշիվն ապաակտիվացված է"
    },
    EMAIL_VERIFY:{
        English:"Please Verify Your Email",
        Arabic:"الرجاء التحقق من بريدك الإلكتروني",
        Turkish:"Lütfen e-postanızı doğrulayın",
        Persian:"لطفا ایمیل خود را تایید کنید",
        Armenian:"Խնդրում ենք հաստատել ձեր էլ"
    },
    ACCOUNT_CREATED:{
        English:"Account Already Created",
        Arabic:"تم إنشاء الحساب بالفعل",
        Turkish:"Hesap Zaten Oluşturuldu",
        Persian:"حساب قبلا ایجاد شده است",
        Armenian:"Հաշիվն արդեն ստեղծված է"
    },
    PASSWORD_REQUIRED:{
        English:"Password Is Required",
        Arabic:"كلمة المرور مطلوبة",
        Turkish:"Şifre gerekli",
        Persian:"رمز عبور لازم است",
        Armenian:"Գաղտնաբառը պարտադիր է"
    },
    INVALID_OTP:{
        English:"Invalid Otp",
        Arabic:"كلمة المرور غير صالحة",
        Turkish:"geçersiz otp",
        Persian:"otp نامعتبر",
        Armenian:"անվավեր otp"
    },
    INVALID_COFFIE_IMAGE:{
        English:"Please upload valid coffee cup images. With Position",
        Arabic:"يرجى تحميل صور أكواب قهوة صالحة. مع الموقع",
        Turkish:"Lütfen geçerli kahve fincanı görselleri yükleyin. Pozisyonla birlikte",
        Persian:"لطفا تصاویر معتبر از فنجان قهوه را بارگذاری کنید. به همراه موقعیت مکانی",
        Armenian:"Խնդրում ենք վերբեռնել սուրճի բաժակների վավեր պատկերներ։ Դիրքորոշմամբ՝"
    },
    UPLOAD_TWO_IMAGE:{
        English:"Please upload at least Two Images of the coffee Cup to Continue",
        Arabic:"يرجى تحميل صورتين على الأقل لكوب القهوة للاستمرار",
        Turkish:"Devam etmek için lütfen kahve fincanının en az iki resmini yükleyin",
        Persian:"لطفا حداقل دو تصویر از فنجان قهوه را برای ادامه آپلود کنید ",
        Armenian:"Խնդրում ենք վերբեռնել սուրճի բաժակի առնվազն երկու նկար՝ շարունակելու համար"
    },
    NO_READING:{
        English:"You have no readings, please renew and subscribe.",
        Arabic:"ليس لديك أي قراءات يرجى التجديد والاشتراك",
        Turkish:"Hiçbir okumanız yok, lütfen yenileyin ve abone olun.",
        Persian:"شما هیچ مطالعه‌ای ندارید، لطفاً تمدید کنید و مشترک شوید",
        Armenian:"Դուք չունեք որևէ ընթերցանյութ, խնդրում ենք երկարաձգել այն և բաժանորդագրվել"
    },
    INVALID_READNING:{
        English:"Invalid Readnig",
        Arabic:"قراءة غير صالحة",
        Turkish:"geçersiz okuma",
        Persian:"خواندن نامعتبر",
        Armenian:"անվավեր ընթերցում"
    },
    NO_ACTIVE_SUBSCRIPTION:{
        English:"",
        Arabic:"لم يتم العثور على اشتراك نشط",
        Turkish:"Aktif Abonelik bulunamadı",
        Persain:"اشتراک فعالی یافت نشد",
        Armenian:"Ակտիվ բաժանորդագրություն չի գտնվել"
    },
    SUBSCRIPTION_CANCLE:{
        English:"Subscription is already marked for cancellation.",
        Arabic:"لقد تم بالفعل تحديد الاشتراك للإلغاء.",
        Turkish:"Abonelik iptal için işaretlenmiş durumda.",
        Persian:"اشتراک از قبل برای لغو علامت‌گذاری شده است.",
        Armenian:"Բաժանորդագրությունն արդեն նշված է չեղարկման համար։"
    }
}


export default function getErrorMessage(type:string,lang:any){
        return messages[type]?.[lang] || messages[type]?.English
}

