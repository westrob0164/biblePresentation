/**
 * Project: Bible Presentation Exhibit PM
 * File:    js/components/signageVault.js
 * Desc:    Modular component file executing background PHP checks to 
 *          dynamically fetch, list, and embed printable table signs in a split layout.
 **/

export default function signageVault($canvas) {
    $canvas.empty();

    window.dom.create('vault-header', $canvas, { tag: 'h2', text: '🏷️ PRINTABLE EXHIBITION CAPTIONS & SIGNAGE' });
    window.dom.create('vault-desc', $canvas, {
        tag: 'p',
        text: 'Generate and upload your description card PDFs directly inside your data/signage/ folder. Click on any card choice below to read or instantly print it for your physical display tables.',
        style: 'margin: 0 0 20px 0; color: #64748b; font-size: 14px;'
    });

    const $splitWorkspace = window.dom.create('vault-split-workspace', $canvas);
    const $cardsPane = window.dom.create('vault-cards-pane', $splitWorkspace);
    const $previewViewport = window.dom.create('vault-preview-viewport', $splitWorkspace);

    // Initial onboarding help card layout frame
    const $splashNotice = window.dom.create('pdf-viewer-splash', $previewViewport);
    window.dom.create('splash-icon', $splashNotice, { tag: 'div', text: '🏷️', style: 'font-size: 48px; margin-bottom: 10px;' });
    window.dom.create('splash-text', $splashNotice, { tag: 'p', text: 'Select an exhibition description card from the left list to view or print it.' });

    // Query your newly created signage database scanner endpoint script
    fetch('api/get_signage.php')
        .then(res => res.json())
        .then(data => {
            if (!data.success || data.files.length === 0) {
                $cardsPane.remove();
                $previewViewport.empty();
                window.dom.create('empty-notice', $previewViewport, {
                    tag: 'div',
                    text: 'ℹ️ No printable table signage files detected. Add PDF cards to your data/signage/ directory to automatically populate this grid.',
                    style: 'background: #f8fafc; padding: 40px; text-align: center; border-radius: 6px; color: #94a3b8; border: 1px dashed #cbd5e1; width: 100%;'
                });
                return;
            }

            data.files.forEach((file, index) => {
                const $card = window.dom.create('pdf-download-card', $cardsPane, { id: `sign_link_${index}` });
                window.dom.create('pdf-card-title', $card, { tag: 'h4', text: file.title });
                
                const fileKiloBytes = (file.bytes / 1024).toFixed(1);
                window.dom.create('pdf-card-meta', $card, { tag: 'span', text: `📎 ${file.filename} (${fileKiloBytes} KB)` });

                $card.on('click', function() {
                    $cardsPane.find('.pdf-download-card').removeClass('active-pdf');
                    $card.addClass('active-pdf');
                    $previewViewport.empty();

                    window.dom.create('pdf-embedded-frame', $previewViewport, {
                        tag: 'iframe',
                        id: 'sign-render-frame',
                        attr: {
                            src: `${file.path}#toolbar=1&navpanes=0&scrollbar=1`,
                            type: 'application/pdf'
                        }
                    });
                });

                if (index === 0) {
                    $card.trigger('click');
                }
            });
        })
        .catch(err => {
            console.error("🚨 Critical Error reaching api/get_signage.php:", err);
            $previewViewport.empty();
            window.dom.create('error-notice', $previewViewport, { tag: 'div', text: '❌ Network pipeline error loading signage. Verify API configuration.' });
        });
}
