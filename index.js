/* ==========================================================================
   祥宇 ❤️ 麗紘 0927 網頁喜帖互動邏輯 (JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 強制停止瀏覽器自動記憶/還原滾動位置，確保每次重新整理都在最上方
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // ==========================================================================
    // 1. 背景音樂播放控制 (BGM Control)
    // ==========================================================================
    const bgm = document.getElementById('bgm');
    const musicControl = document.getElementById('music-control');
    let isPlaying = false;

    // 預設背景音樂音量為 30%
    if (bgm) {
        bgm.volume = 0.3;
    }

    if (musicControl && bgm) {
        musicControl.addEventListener('click', () => {
            if (bgm.paused) {
                bgm.play().then(() => {
                    isPlaying = true;
                    musicControl.classList.add('playing');
                }).catch(err => console.log('BGM Play Error:', err));
            } else {
                bgm.pause();
                musicControl.classList.remove('playing');
            }
        });
    }

    // ==========================================================================
    // 2. 信封前導頁與 3D 開箱動畫 (Splash Screen Envelope Animation - GitHub 1:1 還原版)
    // ==========================================================================
    const splashScreen = document.getElementById('splash-screen');
    const openBtn = document.getElementById('open-envelope-btn');
    const envelopeContainer = document.querySelector('.envelope-container');
    const envelopeBox = document.getElementById('envelope-box');
    const chibiAnimBoxSplash = document.getElementById('chibi-anim-box-splash');
    const chibiHeartsSplash = document.getElementById('chibi-hearts-splash');
    const flashOverlay = document.getElementById('flash-overlay');
    const mainContent = document.getElementById('main-content');
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

    // 3D 開箱動畫主邏輯 (完全還原 GitHub Pages 線上版節奏)
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
            window.scrollTo(0, 0);
            if (splashScreen) {
                splashScreen.classList.add('page-turn');
            }
            if (mainContent) {
                mainContent.classList.add('main-content-clear');
            }
            document.body.style.overflow = 'auto'; // 恢復網頁滾動
        }, 6900);

        // 步驟 7：8.1s 時，徹底移除前導頁 DOM 節點
        setTimeout(() => {
            if (splashScreen) {
                splashScreen.remove();
            }
        }, 8100);
    }

    // 當點擊「開啟喜帖」按鈕時，撥放背景音樂並啟動開箱動畫
    if (openBtn) {
        openBtn.addEventListener('click', () => {
            // 撥放音樂（利用賓客的點擊動作解鎖 Autoplay）
            if (bgm && bgm.paused) {
                bgm.play().then(() => {
                    isPlaying = true;
                    if (musicControl) musicControl.classList.add('playing');
                }).catch(err => {
                    console.log("背景音樂自動播放受限：", err);
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

    // 防卡住雙擊快速跳過
    if (splashScreen) {
        splashScreen.addEventListener('dblclick', () => {
            if (splashScreen) splashScreen.remove();
            document.body.style.overflow = 'auto';
        });
    }

    // ==========================================================================
    

    // ==========================================================================
    // 方案 A：3D 擬真電子翻頁書互動邏輯 (3D Flipbook Logic)
    // ==========================================================================
    const btnGroom = document.getElementById('btn-view-groom');
    const btnBride = document.getElementById('btn-view-bride');
    const flipbookGroom = document.getElementById('flipbook-groom');
    const flipbookBride = document.getElementById('flipbook-bride');
    const timelineSwitcher = document.querySelector('.timeline-switcher');

    const btnFlipPrev = document.getElementById('btn-flip-prev');
    const btnFlipNext = document.getElementById('btn-flip-next');
    const currentPageNumEl = document.getElementById('current-page-num');
    const totalPageNumEl = document.getElementById('total-page-num');

    let currentPerspective = 'groom'; // 'groom' 或 'bride'
    let currentPageGroom = 1;
    let currentPageBride = 1;

    function getActivePerspectiveContainer() {
        return currentPerspective === 'groom' ? flipbookGroom : flipbookBride;
    }

    function getCurrentPage() {
        return currentPerspective === 'groom' ? currentPageGroom : currentPageBride;
    }

    function setCurrentPage(num) {
        if (currentPerspective === 'groom') {
            currentPageGroom = num;
        } else {
            currentPageBride = num;
        }
    }

    function updateFlipbookState() {
        const container = getActivePerspectiveContainer();
        if (!container) return;

        const pages = container.querySelectorAll('.flip-page');
        const totalPages = pages.length;
        let currentPage = getCurrentPage();

        if (currentPage < 1) currentPage = 1;
        if (currentPage > totalPages) currentPage = totalPages;
        setCurrentPage(currentPage);

        pages.forEach((page, index) => {
            const pageNum = index + 1;
            page.classList.remove('active-page', 'flipped-left', 'flipped-right');

            if (pageNum === currentPage) {
                page.classList.add('active-page');
            } else if (pageNum < currentPage) {
                page.classList.add('flipped-left');
            } else {
                page.classList.add('flipped-right');
            }
        });

        if (currentPageNumEl) currentPageNumEl.innerText = currentPage;
        if (totalPageNumEl) totalPageNumEl.innerText = totalPages;

        if (btnFlipPrev) btnFlipPrev.disabled = (currentPage === 1);
        if (btnFlipNext) btnFlipNext.disabled = (currentPage === totalPages);
    }

    if (btnFlipPrev) {
        btnFlipPrev.addEventListener('click', () => {
            let currentPage = getCurrentPage();
            if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
                updateFlipbookState();
            }
        });
    }

    if (btnFlipNext) {
        btnFlipNext.addEventListener('click', () => {
            const container = getActivePerspectiveContainer();
            const totalPages = container ? container.querySelectorAll('.flip-page').length : 16;
            let currentPage = getCurrentPage();
            if (currentPage < totalPages) {
                setCurrentPage(currentPage + 1);
                updateFlipbookState();
            }
        });
    }

    // 手動觸發視角切換 (大寶 / 小寶)
    if (btnGroom && btnBride && flipbookGroom && flipbookBride) {
        btnGroom.addEventListener('click', () => {
            if (currentPerspective === 'groom') return;

            currentPerspective = 'groom';
            btnGroom.classList.add('active');
            btnBride.classList.remove('active');
            if (timelineSwitcher) timelineSwitcher.classList.remove('bride-active');

            flipbookBride.style.display = 'none';
            flipbookGroom.style.display = 'block';
            updateFlipbookState();
        });

        btnBride.addEventListener('click', () => {
            if (currentPerspective === 'bride') return;

            currentPerspective = 'bride';
            btnBride.classList.add('active');
            btnGroom.classList.remove('active');
            if (timelineSwitcher) timelineSwitcher.classList.add('bride-active');

            flipbookGroom.style.display = 'none';
            flipbookBride.style.display = 'block';
            updateFlipbookState();
        });
    }

    // 支援滑鼠點擊/拖曳與手機觸控滑動直接在相簿/照片上翻頁
    const flipbookBook = document.querySelector('.flipbook-book');
    if (flipbookBook) {
        let isDragging = false;
        let startX = 0;

        flipbookBook.addEventListener('mousedown', (e) => {
            isDragging = false;
            startX = e.clientX;
        });

        flipbookBook.addEventListener('mousemove', (e) => {
            if (Math.abs(e.clientX - startX) > 10) {
                isDragging = true;
            }
        });

        flipbookBook.addEventListener('mouseup', (e) => {
            const dragDistance = e.clientX - startX;

            if (isDragging) {
                if (dragDistance < -30) {
                    if (btnFlipNext && !btnFlipNext.disabled) btnFlipNext.click();
                } else if (dragDistance > 30) {
                    if (btnFlipPrev && !btnFlipPrev.disabled) btnFlipPrev.click();
                }
            } else {
                const rect = flipbookBook.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                if (clickX > rect.width / 2) {
                    if (btnFlipNext && !btnFlipNext.disabled) btnFlipNext.click();
                } else {
                    if (btnFlipPrev && !btnFlipPrev.disabled) btnFlipPrev.click();
                }
            }
        });

        // 手機觸控
        let touchStartX = 0;
        let touchEndX = 0;

        flipbookBook.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        flipbookBook.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const swipeDistance = touchEndX - touchStartX;

            if (swipeDistance < -40) {
                if (btnFlipNext && !btnFlipNext.disabled) btnFlipNext.click();
            } else if (swipeDistance > 40) {
                if (btnFlipPrev && !btnFlipPrev.disabled) btnFlipPrev.click();
            }
        }, { passive: true });
    }

    // 初始化翻頁相本狀態
    updateFlipbookState();


    // 4. 婚禮倒數計時器 (Countdown Timer)
    // ==========================================================================
    const weddingDate = new Date('2026-09-27T11:30:00+08:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = weddingDate - now;

        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            const elDays = document.getElementById('days');
            const elHours = document.getElementById('hours');
            const elMinutes = document.getElementById('minutes');
            const elSeconds = document.getElementById('seconds');

            if (elDays) elDays.innerText = String(days).padStart(2, '0');
            if (elHours) elHours.innerText = String(hours).padStart(2, '0');
            if (elMinutes) elMinutes.innerText = String(minutes).padStart(2, '0');
            if (elSeconds) elSeconds.innerText = String(seconds).padStart(2, '0');
        }
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ==========================================================================
    // 5. 加入行事曆按鈕 (Google & Apple Calendar)
    // ==========================================================================
    const btnGoogleCal = document.getElementById('btn-gcal') || document.getElementById('add-to-google-cal');
    const btnAppleCal = document.getElementById('btn-ical') || document.getElementById('add-to-apple-cal');

    if (btnGoogleCal) {
        btnGoogleCal.addEventListener('click', (e) => {
            e.preventDefault();
            const title = encodeURIComponent('祥宇 ❤️ 麗紘 的婚禮');
            const details = encodeURIComponent('誠摯邀請您出席我們的婚宴！\n時間：11:30 入席 | 12:00 開席\n地點：林邊永鑫海鮮餐廳 (屏東縣林邊鄉中山路379號)');
            const location = encodeURIComponent('林邊永鑫海鮮餐廳, 屏東縣林邊鄉中山路379號');
            const dates = '20260927T033000Z/20260927T083000Z'; // UTC 時間

            const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
            window.open(url, '_blank');
        });
    }

    if (btnAppleCal) {
        btnAppleCal.addEventListener('click', (e) => {
            e.preventDefault();
            const icsData = [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'PRODID:-//Wedding Invitation//ZH-TW',
                'BEGIN:VEVENT',
                'SUMMARY:祥宇 ❤️ 麗紘 的婚禮',
                'DESCRIPTION:誠摯邀請您出席我們的婚宴！\\n時間：11:30 入席 | 12:00 開席\\n地點：林邊永鑫海鮮餐廳 (屏東縣林邊鄉中山路379號)',
                'LOCATION:林邊永鑫海鮮餐廳, 屏東縣林邊鄉中山路379號',
                'DTSTART:20260927T033000Z',
                'DTEND:20260927T083000Z',
                'END:VEVENT',
                'END:VCALENDAR'
            ].join('\n');

            const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.setAttribute('download', 'wedding-event.ics');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // ==========================================================================
    // 6. 訂婚影片與背景音樂連動
    // ==========================================================================
    const videoPlayer = document.getElementById('engagement-video-player');
    if (videoPlayer && bgm) {
        videoPlayer.addEventListener('play', () => {
            bgm.pause();
            if (musicControl) musicControl.classList.remove('playing');
        });
        videoPlayer.addEventListener('pause', () => {
            if (isPlaying) {
                bgm.play();
                if (musicControl) musicControl.classList.add('playing');
            }
        });
    }

    // ==========================================================================
    // 7. 婚紗相簿 Lightbox 燈箱效果
    // ==========================================================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close') || document.getElementById('lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev') || document.getElementById('lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next') || document.getElementById('lightbox-next');

    let currentPhotoIndex = 0;
    const galleryImages = Array.from(document.querySelectorAll('.gallery-item img'));

    function openLightbox(index) {
        if (!lightbox || !galleryImages[index]) return;
        currentPhotoIndex = index;
        if (lightboxImg) lightboxImg.src = galleryImages[currentPhotoIndex].src;
        lightbox.style.display = 'flex';
        setTimeout(() => lightbox.classList.add('active'), 10);
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        setTimeout(() => lightbox.style.display = 'none', 300);
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            currentPhotoIndex = (currentPhotoIndex - 1 + galleryImages.length) % galleryImages.length;
            openLightbox(currentPhotoIndex);
        });
    }
    if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            currentPhotoIndex = (currentPhotoIndex + 1) % galleryImages.length;
            openLightbox(currentPhotoIndex);
        });
    }

    // ==========================================================================
    // 8. RSVP 表單計數器
    // ==========================================================================
    const counters = document.querySelectorAll('.counter-wrapper');
    counters.forEach(counter => {
        const input = counter.querySelector('input');
        const minusBtn = counter.querySelector('.minus');
        const plusBtn = counter.querySelector('.plus');

        if (input && minusBtn && plusBtn) {
            minusBtn.addEventListener('click', (e) => {
                e.preventDefault();
                let val = parseInt(input.value) || 0;
                let min = parseInt(input.getAttribute('min')) || 0;
                if (val > min) {
                    input.value = val - 1;
                }
            });
            plusBtn.addEventListener('click', (e) => {
                e.preventDefault();
                let val = parseInt(input.value) || 0;
                let max = parseInt(input.getAttribute('max')) || 10;
                if (val < max) {
                    input.value = val + 1;
                }
            });
        }
    });

    // ==========================================================================
    // 9. 滾動淡入觀察器 (Scroll Reveal)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));
});
