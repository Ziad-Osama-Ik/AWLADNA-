// 1. ربط حسابك بـ EmailJS (الـ Public Key بتاعك)
(function() {
    emailjs.init("vvYwfG7KDTL_fwSgd"); 
})();

document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');
    
    if (bookingForm) {
        // استخدام onsubmit لضمان السيطرة الكاملة على الفورم ومنع الـ Reload
        bookingForm.onsubmit = function(e) {
            e.preventDefault(); 

            // 2. سحب البيانات من الفورم بالـ IDs اللي في الـ HTML بتاعك
            const name = document.getElementById('childName').value;
            const age = document.getElementById('childAge').value;
            const branch = document.getElementById('branch').value;
            const day = document.getElementById('interviewDay').value;

            // 3. حساب موعد عشوائي (عشان السيستم يبان ذكي للأهالي)
            const times = ["09:00", "09:20", "09:40", "10:00", "10:20", "10:40"];
            const selectedTime = times[Math.floor(Math.random() * times.length)];

            // 4. تجهيز البيانات (لازم تكون نفس الأسماء اللي في التمبلت {{ }})
        const templateParams = {
    child_name: document.getElementById('childName').value,
    child_age: document.getElementById('childAge').value,
    branch: document.getElementById('branch').value,
    day: document.getElementById('interviewDay').value,
    time: selectedTime // المتغير اللي حسبنا فيه الوقت العشوائي
};

            // 5. إرسال الإيميل (بالـ IDs الجديدة والمؤكدة بتاعتك)
            emailjs.send("service_u7c20rs", "template_jra4ixw", templateParams)
                .then(function(response) {
                    console.log('تم الإرسال بنجاح!', response.status, response.text);
                    
                    // 6. توليد الـ QR Code (رابط واتساب للحضانة)
                    const whatsappMsg = encodeURIComponent(`تأكيد حجز لـ ${name}\nالفرع: ${branch}\nالموعد: ${day} - ${selectedTime} ص`);
                    const whatsappLink = `https://wa.me/201552358200?text=${whatsappMsg}`;

                    const qrBox = document.getElementById('qrcode');
                    qrBox.innerHTML = ""; // مسح القديم
                    new QRCode(qrBox, {
                        text: whatsappLink,
                        width: 200,
                        height: 200,
                        colorDark : "#814299",
                        colorLight : "#ffffff"
                    });

                    // 7. تحديث البيانات في المودال وفتحه
                    document.getElementById('appointmentDetails').innerHTML = `
                        الطفل: <strong>${name}</strong><br>
                        الفرع: <strong>${branch}</strong><br>
                        الموعد: <strong>${day} الساعة ${selectedTime} ص</strong>
                    `;
                    
                    var myModal = new bootstrap.Modal(document.getElementById('qrModal'));
                    myModal.show();

                }, function(error) {
                    console.log('فشل الإرسال...', error);
                    alert("حدث خطأ: " + JSON.stringify(error));
                });

            return false; // زيادة تأكيد لمنع الـ Reload
        };
    }
});