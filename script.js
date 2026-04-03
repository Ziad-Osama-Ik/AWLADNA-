// 1. ربط حسابك بـ EmailJS (الـ Public Key بتاعك)
(function() {
    emailjs.init("vvYwfG7KDTL_fwSgd"); 
})();

document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');
    
    if (bookingForm) {
        bookingForm.onsubmit = function(e) {
            e.preventDefault(); 

            // 2. سحب البيانات من الفورم
            const name = document.getElementById('childName').value;
            const age = document.getElementById('childAge').value;
            const branch = document.getElementById('branch').value;
            const day = document.getElementById('interviewDay').value;

            // 3. حساب موعد عشوائي
            const times = ["09:00", "09:20", "09:40", "10:00", "10:20", "10:40"];
            const selectedTime = times[Math.floor(Math.random() * times.length)];

            // 4. تجهيز البيانات للإرسال
            const templateParams = {
                child_name: name,
                child_age: age,
                branch: branch,
                day: day,
                time: selectedTime
            };

            // --- الخطوة الجديدة: إرسال البيانات لجوجل شيت عبر SheetDB ---
            fetch('https://sheetdb.io/api/v1/oic4idl5mdigd', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: [templateParams]
                })
            })
            .then(response => response.json())
            .then(data => console.log('تم التسجيل في الشيت بنجاح:', data))
            .catch(error => console.error('خطأ في الشيت:', error));
            // -------------------------------------------------------

            // 5. إرسال الإيميل عبر EmailJS
            emailjs.send("service_u7c20rs", "template_jra4ixw", templateParams)
                .then(function(response) {
                    console.log('تم إرسال الإيميل بنجاح!', response.status, response.text);
                    
                    // 6. توليد الـ QR Code (رابط واتساب)
                    const whatsappMsg = encodeURIComponent(`تأكيد حجز لـ ${name}\nالفرع: ${branch}\nالموعد: ${day} - ${selectedTime} ص`);
                    const whatsappLink = `https://wa.me/201552358200?text=${whatsappMsg}`;

                    const qrBox = document.getElementById('qrcode');
                    qrBox.innerHTML = ""; 
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
                    console.log('فشل إرسال الإيميل...', error);
                    alert("حدث خطأ في الإرسال، برجاء المحاولة مرة أخرى.");
                });

            return false; 
        };
    }
});