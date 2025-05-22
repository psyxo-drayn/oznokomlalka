document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('cuteForm');
    const submitBtn = document.getElementById('submitBtn');
    const additionalQuestions = document.getElementById('additionalQuestions');
    let isSubmitting = false; // Флаг для блокировки двойной отправки
    let questionCount = 5; // У нас уже есть 5 вопросов

    // Функция для добавления нового вопроса
    function addQuestion() {
        const newQuestion = prompt('Введите ваш дополнительный вопрос:');
        if (newQuestion) {
            const questionId = 'question' + questionCount;
            
            const questionDiv = document.createElement('div');
            questionDiv.className = 'form-group';
            
            const label = document.createElement('label');
            label.setAttribute('for', questionId);
            label.textContent = newQuestion;
            
            const input = document.createElement('input');
            input.type = 'text';
            input.id = questionId;
            input.name = questionId;
            input.placeholder = 'Ответ...';
            
            const errorSpan = document.createElement('span');
            errorSpan.className = 'error-message';
            
            questionDiv.appendChild(label);
            questionDiv.appendChild(input);
            questionDiv.appendChild(errorSpan);
            
            additionalQuestions.appendChild(questionDiv);
            questionCount++;
            
            input.addEventListener('input', validateForm);
        }
    }
    
    window.addQuestion = addQuestion;
    
    // Валидация формы
    function validateForm() {
        let isValid = true;
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            const errorSpan = input.nextElementSibling;
            
            if (input.value.trim() === '') {
                isValid = false;
                if (errorSpan && errorSpan.classList.contains('error-message')) {
                    errorSpan.textContent = 'Пожалуйста, заполните это поле';
                    errorSpan.style.display = 'block';
                    input.style.borderColor = '#ff6b6b';
                }
            } else {
                if (errorSpan && errorSpan.classList.contains('error-message')) {
                    errorSpan.style.display = 'none';
                    input.style.borderColor = '#ffe5ec';
                }
            }
        });
        
        submitBtn.disabled = !isValid || isSubmitting;
        return isValid;
    }
    
    // Проверка при вводе
    form.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', validateForm);
    });
    
    // Обработка отправки формы (используем fetch для AJAX)
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (isSubmitting) return;
        
        if (validateForm()) {
            isSubmitting = true;
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Отправка... <span class="button-emoji">⏳</span>';
            
            fetch(form.action, {
                method: 'POST',
                body: new FormData(form)
            })
            .then(response => response.text())
            .then(data => {
                alert('Спасибо! Твои ответы отправлены! 💖');
                form.reset();
                submitBtn.disabled = true;
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Упс! Что-то пошло не так. Попробуй еще раз.');
            })
            .finally(() => {
                isSubmitting = false;
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span class="button-text">Нажми на меня и напиши мне в ТГ</span> <span class="button-emoji">💌</span>';
            });
        } else {
            const firstInvalidInput = form.querySelector('input:invalid, textarea:invalid') || 
                                     form.querySelector('.error-message[style="display: block;"]')?.previousElementSibling;
            
            if (firstInvalidInput) {
                firstInvalidInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalidInput.focus();
            }
        }
    });
    
    submitBtn.disabled = true;
});