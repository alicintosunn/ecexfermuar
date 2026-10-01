import nodemailer from "nodemailer";

type SmtpSettings={smtpHost?:string;smtpPort?:string;smtpSecure?:string;smtpUser?:string;smtpPassword?:string};
type Mail={to:string;subject:string;text:string;html?:string};

export async function sendSmtpMail(settings:SmtpSettings,mail:Mail){
 const host=settings.smtpHost?.trim(),user=settings.smtpUser?.trim(),password=settings.smtpPassword||"",port=Number(settings.smtpPort||587);
 if(!host)throw new Error("SMTP sunucusu boş.");if(!user)throw new Error("SMTP kullanıcı adı boş.");if(!password)throw new Error("SMTP şifresi boş.");if(!Number.isInteger(port)||port<1||port>65535)throw new Error("SMTP portu geçersiz.");
 const secure=settings.smtpSecure==="true"||port===465;
 const transporter=nodemailer.createTransport({host,port,secure,requireTLS:!secure,auth:{user,pass:password},connectionTimeout:15000,greetingTimeout:15000,socketTimeout:20000});
 await transporter.sendMail({from:user,to:mail.to,subject:mail.subject.replace(/[\r\n]/g," "),text:mail.text,html:mail.html||`<p>${escapeHtml(mail.text).replace(/\n/g,"<br>")}</p>`});
 return{ok:true};
}
function escapeHtml(value:string){return value.replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char]!))}
