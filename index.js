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

    // 當 HTML5 訂婚影片開始播放時，自動暫停背景音樂
    const videoPlayer = document.getElementById('engagement-video-player');
    if (videoPlayer) {
        videoPlayer.addEventListener('play', () => {
            if (bgm && !bgm.paused) {
                bgm.pause();
                musicControl.classList.remove('playing');
            }
        });
    }


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

    // 當點擊「開啟喜帖」按鈕時，撥放背景音樂並啟動開箱動畫
    const openBtn = document.getElementById('open-envelope-btn');
    if (openBtn) {
        openBtn.addEventListener('click', () => {
            // 撥放音樂（利用賓客的點擊動作直接解鎖瀏覽器 Autoplay 政策限制）
            if (bgm.paused) {
                bgm.play().then(() => {
                    musicControl.classList.add('playing');
                }).catch(err => {
                    console.log("音樂播放失敗，已靜音：", err);
                });
            }
            // 按鈕淡出動效並銷毀
            openBtn.style.opacity = '0';
            openBtn.style.transform = 'translateX(-50%) translateY(10px) scale(0.9)';
            openBtn.style.pointerEvents = 'none';
            setTimeout(() => {
                openBtn.remove();
            }, 300);

            // 啟動 3D 開箱動畫
            runSplashAnimation();
        });
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
    // 5. RSVP 表單點擊跳轉 (Google Form Redirect with heart burst animation)
    // ==========================================================================
    const redirectBtn = document.getElementById('rsvp-redirect-btn');
    const loadingBox = document.getElementById('rsvp-loading-box');

    // 點擊按鈕時飄出滿滿愛心的特效
    function spawnFloatingHeart(x, y) {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.position = 'fixed';
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        heart.style.fontSize = (Math.random() * 15 + 15) + 'px';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '99999';
        heart.style.transition = 'all 1.2s cubic-bezier(0.25, 1, 0.5, 1)';
        
        document.body.appendChild(heart);
        
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 80 + 40;
        const destX = x + Math.cos(angle) * distance;
        const destY = y + Math.sin(angle) * distance - 80;
        
        setTimeout(() => {
            heart.style.transform = `translate(${destX - x}px, ${destY - y}px) scale(0.5) rotate(${Math.random() * 90 - 45}deg)`;
            heart.style.opacity = '0';
        }, 10);
        
        setTimeout(() => {
            heart.remove();
        }, 1200);
    }

    if (redirectBtn && loadingBox) {
        redirectBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 取得按鈕座標中心點
            const rect = redirectBtn.getBoundingClientRect();
            const btnX = rect.left + rect.width / 2;
            const btnY = rect.top + rect.height / 2;
            
            // 噴灑愛心效果
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    spawnFloatingHeart(btnX + (Math.random() * 40 - 20), btnY + (Math.random() * 20 - 10));
                }, i * 35);
            }
            
            // 按鈕動態回彈與縮小
            redirectBtn.style.transform = 'scale(0.95)';
            redirectBtn.style.opacity = '0.7';
            redirectBtn.style.pointerEvents = 'none';
            
            // 顯示載入文字
            loadingBox.style.display = 'block';
            
            // 延遲 1.2 秒後進行頁面跳轉
            setTimeout(() => {
                window.location.href = 'https://forms.gle/2Jqroc6Yz7DrAyEaA';
            }, 1200);
        });
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
