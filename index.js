/* ==========================================================================
   祥宇 & 麗紘 0927 網頁喜帖互動邏輯 (JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // 強制停止瀏覽器自動記憶/還原滾動位置，確保每次重新整理都在最上方
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    // ==========================================================================
    // 1. 背景音樂播放控制
    // ==========================================================================
    const bgm = document.getElementById('bgm');
    const musicControl = document.getElementById('music-control');
    let hasInteracted = false;

    // 播放/暫停功能
    function toggleBGM() {
        if (bgm.paused) {
            bgm.play().then(() => {
                musicControl.classList.add('playing');
            }).catch(err => {
                console.log("播放失敗，需要使用者手動點擊：", err);
            });
        } else {
            bgm.pause();
            musicControl.classList.remove('playing');
        }
    }

    musicControl.addEventListener('click', toggleBGM);

    // 首次點擊頁面任何地方嘗試自動播放（因應瀏覽器 Autoplay 政策限制）
    const startAutoplay = () => {
        if (!hasInteracted) {
            hasInteracted = true;
            // 嘗試播放，若失敗則靜音播放或等待手動點擊
            bgm.play().then(() => {
                musicControl.classList.add('playing');
            }).catch(() => {
                console.log("背景音樂自動播放受限，等待手動點擊唱片。");
            });
            // 移除監聽器以防重複觸發
            document.removeEventListener('click', startAutoplay);
            document.removeEventListener('touchstart', startAutoplay);
        }
    };
    
    document.addEventListener('click', startAutoplay);
    document.addEventListener('touchstart', startAutoplay);


    // ==========================================================================
    // 2. 倒數計時器 (Countdown Timer)
    // ==========================================================================
    const countdownEl = document.getElementById('countdown');
    const targetDateStr = countdownEl.getAttribute('data-date');
    const targetDate = new Date(targetDateStr).getTime();

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            clearInterval(countdownInterval);
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // 加上前導零
        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // 立即執行一次


    // ==========================================================================
    // 3. 滾動淡入特效與側邊導覽列 (Scroll Reveal & Nav Highlighter)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const sections = document.querySelectorAll('header, section');
    const navDots = document.querySelectorAll('.nav-dot');

    // 滾動漸顯 IntersectionObserver
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // 漸顯後不再重複觸發
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 側邊導航高亮 IntersectionObserver
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                navDots.forEach(dot => {
                    dot.classList.remove('active');
                    if (dot.getAttribute('href') === `#${sectionId}`) {
                        dot.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.4 // 區塊佔據螢幕40%時啟動高亮
    });

    sections.forEach(section => navObserver.observe(section));


    // ==========================================================================
    // 3.5 開場前導頁 (Splash Screen) 與 Q版跑動擁抱動畫控制
    // ==========================================================================
    const splashScreen = document.getElementById('splash-screen');
    const chibiAnimBoxSplash = document.getElementById('chibi-anim-box-splash');
    const chibiHeartsSplash = document.getElementById('chibi-hearts-splash');
    const flashOverlay = document.getElementById('flash-overlay');
    let splashChibiAnimated = false;

    // 漂浮愛心產生器
    function spawnFloatingHeartSplash() {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerHTML = '❤️';
        
        // 隨機角度與水平位移
        const randomDx = (Math.random() * 80 - 40) + 'px';
        const randomRot = (Math.random() * 40 - 20) + 'deg';
        
        heart.style.setProperty('--dx', randomDx);
        heart.style.setProperty('--rot', randomRot);
        
        // 隨機擺放位置於擁抱合照的中央上方
        heart.style.left = '50%';
        heart.style.top = '10px';
        
        if (chibiHeartsSplash) {
            chibiHeartsSplash.appendChild(heart);
        }
        
        // 1.5 秒後自動銷毀
        setTimeout(() => {
            heart.remove();
        }, 1500);
    }

    const envelopeContainer = document.querySelector('.envelope-container');
    const envelopeBox = document.getElementById('envelope-box');
    const mainContent = document.getElementById('main-content');

    function runSplashAnimation() {
        if (splashChibiAnimated || !chibiAnimBoxSplash) return;
        splashChibiAnimated = true;

        // 步驟 1：延遲 0.5s 時，信封上蓋打開 (flap-open)
        setTimeout(() => {
            if (envelopeBox) {
                envelopeBox.classList.add('flap-open');
            }
        }, 500);

        // 步驟 2：1.3s 時，信封內卡片從信封中飛出 (card-popup)，且信封整體放大聚焦 (zoomed)
        setTimeout(() => {
            if (envelopeBox) {
                envelopeBox.classList.add('card-popup');
            }
            if (envelopeContainer) {
                envelopeContainer.classList.add('zoomed');
            }
        }, 1300);

        // 步驟 3：3.0s 時（卡片完全飛出並回彈定位後），才啟動 Q 版人物奔跑動畫
        setTimeout(() => {
            chibiAnimBoxSplash.classList.add('running');
        }, 3000);

        // 步驟 4：5.0s 時，兩位 Q 版人物相遇擁抱，愛心飄舞
        setTimeout(() => {
            chibiAnimBoxSplash.classList.remove('running');
            chibiAnimBoxSplash.classList.add('hugged');

            let heartCount = 0;
            const heartInterval = setInterval(() => {
                spawnFloatingHeartSplash();
                heartCount++;
                if (heartCount >= 10) {
                    clearInterval(heartInterval);
                }
            }, 180);
        }, 5000);

        // 步驟 5：6.7s 時，觸發金色光芒過渡遮罩
        setTimeout(() => {
            if (flashOverlay) {
                flashOverlay.classList.add('active');
            }
        }, 6700);

        // 步驟 6：6.9s 時，信封淡出滑走，且主網頁模糊逐漸退去 (朦朧開箱)
        setTimeout(() => {
            // 開箱過渡時再次強制將主網頁視角鎖定最頂部，防止重新整理回復在最下方
            window.scrollTo(0, 0);
            
            if (splashScreen) {
                splashScreen.classList.add('page-turn');
            }
            if (mainContent) {
                mainContent.classList.add('main-content-clear');
            }
        }, 6900);

        // 步驟 7：8.1s 時，徹底移除前導頁 DOM 節點
        setTimeout(() => {
            if (splashScreen) {
                splashScreen.remove();
            }
        }, 8100);
    }

    // 自動啟動前導頁動畫
    if (splashScreen) {
        runSplashAnimation();
    }


    // ==========================================================================
    // 4. 婚紗相簿燈箱功能 (Lightbox Gallery)
    // ==========================================================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    let currentPhotoIndex = 0;
    let photoUrls = [];

    // 動態讀取所有的照片路徑以防異步加載
    function updatePhotoUrls() {
        const imgs = document.querySelectorAll('.gallery-img');
        photoUrls = Array.from(imgs).map(img => img.src);
    }
    updatePhotoUrls();

    function openLightbox(index) {
        if (!lightbox || !lightboxImg) return;
        updatePhotoUrls();
        currentPhotoIndex = index;
        if (photoUrls[currentPhotoIndex]) {
            try {
                lightboxImg.src = photoUrls[currentPhotoIndex];
                lightbox.style.display = 'block';
                document.body.style.overflow = 'hidden'; // 鎖定背景捲動
            } catch (err) {
                console.error("openLightbox error: ", err);
            }
        }
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.style.display = 'none';
        document.body.style.overflow = ''; // 恢復背景捲動
    }

    function showPrevPhoto() {
        if (!lightboxImg || photoUrls.length === 0) return;
        currentPhotoIndex = (currentPhotoIndex - 1 + photoUrls.length) % photoUrls.length;
        lightboxImg.src = photoUrls[currentPhotoIndex];
    }

    function showNextPhoto() {
        if (!lightboxImg || photoUrls.length === 0) return;
        currentPhotoIndex = (currentPhotoIndex + 1) % photoUrls.length;
        lightboxImg.src = photoUrls[currentPhotoIndex];
    }

    // 採用最強韌的事件委派（Event Delegation）綁定點擊，防止任何內層覆蓋元素攔截點擊
    const galleryGrid = document.querySelector('.gallery-grid');
    if (galleryGrid) {
        galleryGrid.addEventListener('click', (e) => {
            const item = e.target.closest('.gallery-item');
            if (item) {
                e.preventDefault();
                e.stopPropagation();
                
                const allItems = Array.from(document.querySelectorAll('.gallery-item'));
                const index = allItems.indexOf(item);
                if (index !== -1) {
                    openLightbox(index);
                }
            }
        });
    }

    // 安全防錯事件監聽綁定
    if (lightbox) {
        if (closeBtn) closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closeLightbox(); });
        if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrevPhoto(); });
        if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNextPhoto(); });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content-container')) {
                closeLightbox();
            }
        });

        // 鍵盤導覽
        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === 'block') {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrevPhoto();
                if (e.key === 'ArrowRight') showNextPhoto();
            }
        });
    }


    // ==========================================================================
    // 5. RSVP 多步驟表單邏輯 (Multi-step Form)
    // ==========================================================================
    const form = document.getElementById('wedding-rsvp-form');
    const steps = document.querySelectorAll('.form-step');
    const progressBar = document.getElementById('rsvp-progress');
    const stepNumText = document.getElementById('current-step-num');
    
    const prevStepBtn = document.getElementById('prev-btn');
    const nextStepBtn = document.getElementById('next-btn');
    const submitStepBtn = document.getElementById('submit-btn');
    const successScreen = document.getElementById('rsvp-success-screen');

    let currentStep = 1;
    const totalSteps = 6;

    // 偵測出席狀態以進行步驟跳轉
    function getAttendanceStatus() {
        const selected = document.querySelector('input[name="attendance"]:checked');
        return selected ? selected.value : 'attend';
    }

    // 計算下一個或上一個應該到達的步驟（跳過條件區段）
    function getNextTargetStep(direction) {
        const attendance = getAttendanceStatus();
        
        if (attendance !== 'attend') {
            // 如果不出席或僅禮到，跳過步驟 3, 4, 5，直接到 6 (祝福)
            if (direction === 'next') {
                if (currentStep === 2) return 6;
            } else if (direction === 'prev') {
                if (currentStep === 6) return 2;
            }
        }
        
        return direction === 'next' ? currentStep + 1 : currentStep - 1;
    }

    // 更新進度條與按鈕文字
    function updateFormNavigation() {
        steps.forEach(step => {
            step.classList.remove('active');
            if (parseInt(step.getAttribute('data-step')) === currentStep) {
                step.classList.add('active');
            }
        });

        // 更新進度條寬度
        const progressPercentage = (currentStep / totalSteps) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        stepNumText.textContent = currentStep;

        // 上一步按鈕狀態
        prevStepBtn.disabled = currentStep === 1;

        // 下一步與送出按鈕切換
        if (currentStep === totalSteps) {
            nextStepBtn.style.display = 'none';
            submitStepBtn.style.display = 'block';
        } else {
            nextStepBtn.style.display = 'block';
            submitStepBtn.style.display = 'none';
        }
    }

    // 欄位防呆驗證
    function validateStep(step) {
        let isValid = true;
        const currentStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
        if (!currentStepEl) return true;

        // 驗證必填文字與電話欄位
        const requiredInputs = currentStepEl.querySelectorAll('input[required], textarea[required]');
        requiredInputs.forEach(input => {
            const formGroup = input.closest('.form-group');
            if (!input.value.trim()) {
                isValid = false;
                if (formGroup) formGroup.classList.add('has-error');
            } else {
                if (formGroup) formGroup.classList.remove('has-error');
                
                // 額外驗證電話格式 (若為電話欄位)
                if (input.type === 'tel') {
                    const phonePattern = /^09\d{8}$/;
                    if (!phonePattern.test(input.value.replace(/[-\s]/g, ''))) {
                        isValid = false;
                        if (formGroup) {
                            formGroup.classList.add('has-error');
                            formGroup.querySelector('.error-msg').textContent = '請輸入正確的 10 碼行動電話（如：0912345678）';
                        }
                    } else {
                        if (formGroup) formGroup.classList.remove('has-error');
                    }
                }
            }
        });

        // 驗證必填單選按鈕
        const radioGroups = {};
        const requiredRadios = currentStepEl.querySelectorAll('input[type="radio"][required]');
        requiredRadios.forEach(radio => {
            radioGroups[radio.name] = true;
        });

        for (const name in radioGroups) {
            const selected = currentStepEl.querySelector(`input[name="${name}"]:checked`);
            const groupContainer = currentStepEl.querySelector('.option-card-group') || currentStepEl.querySelector('.radio-pill-group');
            if (!selected) {
                isValid = false;
                if (groupContainer) groupContainer.style.borderColor = '#c95d5d';
            } else {
                if (groupContainer) groupContainer.style.borderColor = '';
            }
        }

        return isValid;
    }

    // 移除驗證錯誤 class
    form.addEventListener('input', (e) => {
        const formGroup = e.target.closest('.form-group');
        if (formGroup && formGroup.classList.contains('has-error')) {
            formGroup.classList.remove('has-error');
        }
    });

    // 「下一步」點擊事件
    nextStepBtn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            currentStep = getNextTargetStep('next');
            updateFormNavigation();
            // 自動滾動到表單頂部
            document.getElementById('rsvp').scrollIntoView({ behavior: 'smooth' });
        }
    });

    // 「上一步」點擊事件
    prevStepBtn.addEventListener('click', () => {
        currentStep = getNextTargetStep('prev');
        updateFormNavigation();
        document.getElementById('rsvp').scrollIntoView({ behavior: 'smooth' });
    });


    // ==========================================================================
    // 6. 數字增減器功能 (Counter Controller) & 連動邏輯
    // ==========================================================================
    const counterButtons = document.querySelectorAll('.counter-btn');
    const adultInput = document.getElementById('adult-count');
    const meatInput = document.getElementById('meat-count');
    const vegInput = document.getElementById('veg-count');

    // 連動邏輯：預設葷食席位 = 大人人數
    function syncDietWithAdults(newAdultVal) {
        const currentVeg = parseInt(vegInput.value);
        if (currentVeg === 0) {
            meatInput.value = newAdultVal;
        } else {
            // 讓葷素總和維持與大人人數一致
            if (currentVeg >= newAdultVal) {
                vegInput.value = newAdultVal;
                meatInput.value = 0;
            } else {
                meatInput.value = newAdultVal - currentVeg;
            }
        }
    }

    counterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = btn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            let val = parseInt(input.value);
            const min = parseInt(input.getAttribute('min') || 0);
            const max = parseInt(input.getAttribute('max') || 10);

            if (btn.classList.contains('plus')) {
                if (val < max) val++;
            } else {
                if (val > min) val--;
            }

            input.value = val;

            // 觸發連動
            if (targetId === 'adult-count') {
                syncDietWithAdults(val);
            }
            
            // 葷素人數改變時，動態微調以符合大人總數
            if (targetId === 'meat-count' || targetId === 'veg-count') {
                const totalAdults = parseInt(adultInput.value);
                const meat = parseInt(meatInput.value);
                const veg = parseInt(vegInput.value);

                if (meat + veg !== totalAdults) {
                    if (targetId === 'meat-count') {
                        // 調整素食
                        vegInput.value = Math.max(0, totalAdults - meat);
                    } else {
                        // 調整葷食
                        meatInput.value = Math.max(0, totalAdults - veg);
                    }
                }
            }
        });
    });


    // ==========================================================================
    // 7. 表單提交、Local Storage 快取與五彩紙屑慶祝 (Confetti)
    // ==========================================================================
    const successName = document.getElementById('confirmed-guest-name');
    const summaryList = document.getElementById('confirmed-details-list');
    const editRsvpBtn = document.getElementById('edit-rsvp-btn');

    // 檢查 Local Storage 是否可用 (防範 Safari file:// 本地瀏覽時的 SecurityError)
    function safeGetLocalStorage(key) {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            console.warn("LocalStorage is not accessible:", e);
            return null;
        }
    }

    function safeSetLocalStorage(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            console.warn("LocalStorage setItem failed:", e);
        }
    }

    // 檢查 Local Storage 是否已有填寫紀錄
    const cachedRSVP = safeGetLocalStorage('wedding_rsvp_xiangyu_lihong');
    if (cachedRSVP) {
        showSuccessState(JSON.parse(cachedRSVP));
    }

    // 串接 Google 表單發送
    function submitToGoogleForm(data) {
        // Google 表單發送後台網址
        const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSd4PFyKDrAIFH4j_sWGOrh-QMzOIPIfWo5CqK_a5luF5oUTTQ/formResponse';
        
        // 欄位代碼映射表 (若您找到 entry.xxx 代碼，請替換冒號右側的預設 entry 字串)
        const fieldMapping = {
            'name': 'entry.1812836262',        // 姓名 欄位
            'phone': 'entry.390022718',        // 聯絡電話 欄位
            'attendance': 'entry.101738722',   // 出席意願 欄位
            'relation': 'entry.128766155',     // 親友關係 欄位
            'adult_count': 'entry.198372671',  // 出席大人人數 欄位
            'kid_count': 'entry.1742055627',   // 出席幼童人數 欄位
            'meat_count': 'entry.209381711',   // 葷食人數 欄位
            'veg_count': 'entry.155739017',    // 素食人數 欄位
            'chair_count': 'entry.184758291',  // 嬰兒座椅數量 欄位
            'transport': 'entry.990429402',    // 交通方式 欄位
            'wishes': 'entry.209381735'        // 給新人的祝福話語 欄位
        };

        const formBody = new URLSearchParams();
        
        // 填充資料到 POST 表單中
        for (const [key, value] of Object.entries(data)) {
            const googleField = fieldMapping[key];
            if (googleField) {
                formBody.append(googleField, value || '');
            }
        }

        // 以 no-cors 模式發送非同步 POST 請求，防止跨網域錯誤阻擋提交
        fetch(googleFormUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formBody
        })
        .then(() => {
            console.log('表單資料已自動發送對應至 Google 表單後台 (no-cors)');
        })
        .catch((error) => {
            console.error('發送表單至 Google 失敗:', error);
        });
    }

    // 提交表單
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!validateStep(currentStep)) return;

        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // 存檔至 Local Storage
        safeSetLocalStorage('wedding_rsvp_xiangyu_lihong', JSON.stringify(data));

        // 發送至 Google 表單後台
        submitToGoogleForm(data);

        // 觸發成功畫面與慶祝
        showSuccessState(data);
        triggerConfetti();
        document.getElementById('rsvp').scrollIntoView({ behavior: 'smooth' });
    });

    // 顯示成功畫面與摘要
    function showSuccessState(data) {
        form.style.display = 'none';
        successScreen.style.display = 'block';
        
        successName.textContent = data.name;
        
        // 編譯親切的摘要列表
        let summaryHTML = '';
        
        const attendanceMap = {
            'attend': '🎉 準時出席婚宴',
            'gift': '✉️ 禮到人不到',
            'decline': '❤️ 祝福滿滿，不克出席'
        };

        const relationMap = {
            'groom': '男方親友 (祥宇)',
            'bride': '女方親友 (麗紘)',
            'both': '共同好友'
        };

        const transportMap = {
            'drive': '自行開車 🚗',
            'shuttle': '搭乘大眾運輸 🚌',
            'other': '其他方式 / 步行 🚶'
        };

        summaryHTML += `<li><span>出席狀態</span><span>${attendanceMap[data.attendance] || '已送出'}</span></li>`;
        summaryHTML += `<li><span>聯絡電話</span><span>${data.phone}</span></li>`;

        if (data.attendance === 'attend') {
            summaryHTML += `<li><span>親友關係</span><span>${relationMap[data.relation] || '親友'}</span></li>`;
            summaryHTML += `<li><span>出席人數</span><span>大人：${data.adult_count} 人，兒童：${data.kid_count} 人</span></li>`;
            summaryHTML += `<li><span>餐點安排</span><span>葷：${data.meat_count} 位，素：${data.veg_count} 位</span></li>`;
            if (parseInt(data.chair_count) > 0) {
                summaryHTML += `<li><span>幼兒座椅</span><span>${data.chair_count} 張</span></li>`;
            }
            summaryHTML += `<li><span>交通方式</span><span>${transportMap[data.transport] || '自理'}</span></li>`;
        }

        summaryHTML += `<li class="flex-column" style="flex-direction:column; gap:4px; margin-top:10px; border-top:1px dashed rgba(95, 116, 100, 0.2); padding-top:10px;">` +
                       `<span style="width:100%; display:block;">給新人的祝福：</span>` +
                       `<span style="width:100%; display:block; font-style:italic; font-weight:normal !important; color:var(--text-muted); margin-top:2px;">「 ${data.wishes} 」</span></li>`;

        summaryList.innerHTML = summaryHTML;
    }

    // 修改回覆按鈕
    editRsvpBtn.addEventListener('click', () => {
        // 從 cache 讀取，並填回表單
        const cachedData = safeGetLocalStorage('wedding_rsvp_xiangyu_lihong');
        if (cachedData) {
            const data = JSON.parse(cachedData);
            
            // 填回一般 input
            document.getElementById('guest-name').value = data.name || '';
            document.getElementById('guest-phone').value = data.phone || '';
            document.getElementById('wishes').value = data.wishes || '';

            // 填回 radio
            const attendanceRadio = form.querySelector(`input[name="attendance"][value="${data.attendance}"]`);
            if (attendanceRadio) attendanceRadio.checked = true;

            const relationRadio = form.querySelector(`input[name="relation"][value="${data.relation}"]`);
            if (relationRadio) relationRadio.checked = true;

            const transportRadio = form.querySelector(`input[name="transport"][value="${data.transport}"]`);
            if (transportRadio) transportRadio.checked = true;

            // 填回數字計數器
            document.getElementById('adult-count').value = data.adult_count || 1;
            document.getElementById('kid-count').value = data.kid_count || 0;
            document.getElementById('meat-count').value = data.meat_count || 1;
            document.getElementById('veg-count').value = data.veg_count || 0;
            document.getElementById('chair-count').value = data.chair_count || 0;
        }

        // 切回表單畫面
        successScreen.style.display = 'none';
        form.style.display = 'block';
        currentStep = 1;
        updateFormNavigation();
        document.getElementById('rsvp').scrollIntoView({ behavior: 'smooth' });
    });

    // 自訂 Canvas 五彩碎紙效果
    function triggerConfetti() {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '9999';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const colors = ['#5f7464', '#c8a97e', '#ab8d61', '#f0f4f1', '#e8cfa9', '#ffffff'];
        const confettiCount = 150;
        const confettis = [];

        class ConfettiParticle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height - height; // 在上方出生
                this.size = Math.random() * 8 + 4;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.speed = Math.random() * 5 + 3;
                this.angle = Math.random() * Math.PI * 2;
                this.rotationSpeed = Math.random() * 0.2 - 0.1;
                this.oscillationSpeed = Math.random() * 0.1;
                this.oscillationRange = Math.random() * 2;
            }

            update() {
                this.y += this.speed;
                this.angle += this.rotationSpeed;
                this.x += Math.sin(this.angle * this.oscillationSpeed) * this.oscillationRange;

                // 超出邊界回收
                if (this.y > height) {
                    this.y = -20;
                    this.x = Math.random() * width;
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.fillStyle = this.color;
                // 畫一個扁平矩形（模擬彩帶紙片旋轉）
                ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
                ctx.restore();
            }
        }

        for (let i = 0; i < confettiCount; i++) {
            confettis.push(new ConfettiParticle());
        }

        let animationFrameId;
        let framesRun = 0;

        function animate() {
            ctx.clearRect(0, 0, width, height);

            confettis.forEach(c => {
                c.update();
                c.draw();
            });

            framesRun++;
            if (framesRun < 240) { // 持續約 4 秒（60fps * 4 = 240幀）
                animationFrameId = requestAnimationFrame(animate);
            } else {
                cancelAnimationFrame(animationFrameId);
                canvas.remove(); // 結束後移除畫布
            }
        }

        animate();
    }


    // ==========================================================================
    // 8. 加入行事曆整合功能 (Google Calendar & Apple/Outlook ICS)
    // ==========================================================================
    const btnGCal = document.getElementById('btn-gcal');
    const btnICal = document.getElementById('btn-ical');

    const weddingTitle = "祥宇&麗紘的婚禮";
    const weddingDetails = "誠摯邀請您出席我們的婚宴！\n時間：12:00 入席\n地點：林邊永鑫海鮮餐廳 (屏東縣林邊鄉中山路379號)";
    const weddingLocation = "林邊永鑫海鮮餐廳, 屏東縣林邊鄉中山路379號";
    
    // 2026年9月27日 12:00 至 16:30 (UTC+8 即 20260927T040000Z 至 20260927T083000Z)
    const startDate = "20260927T120000";
    const endDate = "20260927T163000";

    // Google Calendar 連結
    btnGCal.addEventListener('click', (e) => {
        e.preventDefault();
        const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(weddingTitle)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(weddingDetails)}&location=${encodeURIComponent(weddingLocation)}&sf=true&output=xml`;
        window.open(gCalUrl, '_blank');
    });

    // Apple/Outlook .ics 檔案下載
    btnICal.addEventListener('click', (e) => {
        e.preventDefault();
        const icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Xiangyu and Lihong//Wedding Invitation//EN
BEGIN:VEVENT
UID:wedding-xiangyu-lihong-20260927
DTSTART;TZID=Asia/Taipei:${startDate}
DTEND;TZID=Asia/Taipei:${endDate}
SUMMARY:${weddingTitle}
DESCRIPTION:${weddingDetails.replace(/\n/g, '\\n')}
LOCATION:${weddingLocation}
BEGIN:VALARM
TRIGGER:-PT24H
ACTION:DISPLAY
DESCRIPTION:明天就是祥宇與麗紘的大囍日子囉！
END:VALARM
END:VEVENT
END:VCALENDAR`;

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', 'wedding_xiangyu_lihong.ics');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // ==========================================================================
    // 8.5 櫻花飄落特效 (Sakura Falling Animation)
    // ==========================================================================
    function initSakuraEffect() {
        const canvas = document.getElementById('sakura-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        
        // 監聽視窗縮放
        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });
        
        const petalCount = 45; // 櫻花瓣總數
        const petals = [];
        
        class Petal {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height - height;
                this.r = Math.random() * 6 + 5; // 花瓣半徑
                this.d = Math.random() * 1.2 + 0.6; // 下落速度
                this.swingSpeed = Math.random() * 0.015 + 0.005; // 搖擺速度
                this.swingAngle = Math.random() * Math.PI * 2;
                this.opacity = Math.random() * 0.35 + 0.5; // 透明度
                this.flip = Math.random(); // 水平翻轉因子
                this.flipSpeed = Math.random() * 0.02 + 0.01;
            }
            
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.swingAngle * 0.3);
                ctx.scale(this.flip, 1);
                
                ctx.beginPath();
                const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.r);
                grad.addColorStop(0, `rgba(255, 205, 215, ${this.opacity})`);
                grad.addColorStop(0.8, `rgba(255, 182, 193, ${this.opacity})`);
                grad.addColorStop(1, 'rgba(255, 182, 193, 0)');
                ctx.fillStyle = grad;
                
                // 繪製微風中的櫻花瓣形狀
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-this.r/2, -this.r/2, -this.r, this.r/3, 0, this.r);
                ctx.bezierCurveTo(this.r, this.r/3, this.r/2, -this.r/2, 0, 0);
                
                ctx.fill();
                ctx.restore();
            }
            
            update() {
                this.y += this.d;
                this.swingAngle += this.swingSpeed;
                this.x += Math.sin(this.swingAngle) * 0.4;
                this.flip += this.flipSpeed;
                
                if (this.flip > 1 || this.flip < -1) {
                    this.flipSpeed = -this.flipSpeed;
                }
                
                // 超出邊界時重設
                if (this.y > height) {
                    this.y = -20;
                    this.x = Math.random() * width;
                    this.opacity = Math.random() * 0.35 + 0.5;
                }
                if (this.x > width) {
                    this.x = 0;
                } else if (this.x < 0) {
                    this.x = width;
                }
            }
        }
        
        // 初始生成
        for (let i = 0; i < petalCount; i++) {
            petals.push(new Petal());
        }
        
        function animate() {
            ctx.clearRect(0, 0, width, height);
            petals.forEach(petal => {
                petal.update();
                petal.draw();
            });
            requestAnimationFrame(animate);
        }
        
        animate();
    }

    // 啟動櫻花特效
    initSakuraEffect();

});
