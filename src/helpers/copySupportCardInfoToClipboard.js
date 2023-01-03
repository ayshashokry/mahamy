import { notification } from "antd";

const copySupportCardInfoToClipboard = (t) => {
  notification.success({
    description: "تم النسخ للحافظة",
    duration: 2,
  });
  const nameSplit = t.name.split(" ");
  const nameLastSubstring = nameSplit[nameSplit.length - 1];
  const ticketNo = nameLastSubstring.replace("#", "");
  const ticketName = t.name.replace(nameLastSubstring, "");

  navigator.clipboard.writeText(
    `\t${t.createdByUsername} : اسم المستخدم\n ` +
    `\tاسم التذكرة : ${ticketName}\n ` +
    `\t${ticketNo} : رقم التذكرة\n ` +
    `\tتفاصيل التذكرة :${t.description} \n ` +
    `\tحالة التذكرة :  قيد المعالجة\n ` 
  );
};

export default copySupportCardInfoToClipboard;
