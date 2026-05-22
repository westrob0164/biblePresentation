/**
 * Project: Bible Presentation Exhibit PM
 * File:    js/components/detailVault.js
 * Desc:    Modular component file executing background PHP checks to 
 *          dynamically fetch, list, and embed PDF blueprints in a split viewport.
 **/

export default function detailVault($canvas) {
    $canvas.empty();

    // 1. Build the titles inside your workspace canvas
    window.dom.create('vault-header', $canvas, {
        tag: 'h2',
        text: '📥 PRINTABLE BLUEPRINTS & CONSTRUCTION GUIDES'
    });

    window.dom.create('vault-desc', $canvas, {
        tag: 'p',
        text: 'Drop your workshop PDF files inside your data/blueprints/ directory to automatically update your display. Click on any blueprint card to open and read it directly within the preview window below.',
        style: 'margin: 0 0 20px 0; color: #64748b; font-size: 14px;'
    });

    // 2. Construct the primary Split Screen Layout Framework Container
    const $splitWorkspace = window.dom.create('vault-split-workspace', $canvas);

    // Left Pane Pane (Holds stacked document option links)
    const $cardsPane = window.dom.create('vault-cards-pane', $splitWorkspace);

    // Right Pane Pane (Holds the live PDF iframe viewport window)
    const $previewViewport = window.dom.create('vault-preview-viewport', $splitWorkspace);

    // Inject an initial introductory message box inside the empty preview frame
    const $splashNotice = window.dom.create('pdf-viewer-splash', $previewViewport);
    window.dom.create('splash-icon', $splashNotice, { tag: 'div', text: '📄', style: 'font-size: 48px; margin-bottom: 10px;' });
    window.dom.create('splash-text', $splashNotice, { tag: 'p', text: 'Select a document guide from the left list sidebar to display its structural contents here.' });

    // 3. Execute background pipeline fetch query targeting our PHP scanner script
    fetch('api/get_blueprints.php')
        .then(res => res.json())
        .then(data => {
            if (!data.success || data.files.length === 0) {
                $cardsPane.remove(); // Clean up sidebar real estate if empty
                $previewViewport.empty();
                
                window.dom.create('empty-notice', $previewViewport, {
                    tag: 'div',
                    text: 'ℹ️ No printable PDF files detected. Add files to your data/blueprints/ directory to automatically populate this grid.',
                    style: 'background: #f8fafc; padding: 40px; text-align: center; border-radius: 6px; color: #94a3b8; border: 1px dashed #cbd5e1; width: 100%;'
                });
                return;
            }

            // 4. Loop through your list arrays cleanly to map out clickable card links
            data.files.forEach((file, index) => {
                const $card = window.dom.create('pdf-download-card', $cardsPane, {
                    id: `pdf_link_${index}`
                });
                
                // Print the clean, formatted document title name
                window.dom.create('pdf-card-title', $card, {
                    tag: 'h4',
                    text: file.title
                });

                const fileKiloBytes = (file.bytes / 1024).toFixed(1);
                window.dom.create('pdf-card-meta', $card, {
                    tag: 'span',
                    text: `📎 ${file.filename} (${fileKiloBytes} KB)`
                });

                // 5. Click Handler: Mount the Interactive PDF Embed on selection
                $card.on('click', function() {
                    // Toggle active visual CSS highlights across the left list
                    $cardsPane.find('.pdf-download-card').removeClass('active-pdf');
                    $card.addClass('active-pdf');

                    // Clear out the stale document display or old message box on the right
                    $previewViewport.empty();

                    // Inject the live browser object canvas embed container frame
                    window.dom.create('pdf-embedded-frame', $previewViewport, {
                        tag: 'iframe', // iframe is highly cross-browser stable for local file streams
                        id: 'pdf-render-frame',
                        attr: {
                            src: `${file.path}#toolbar=1&navpanes=0&scrollbar=1`, // Forces toolbar utilities (print/zoom) to load inside the window frame
                            type: 'application/pdf'
                        }
                    });
                });

                // Auto-select the first blueprint card choice by default on page load to fill screen space
                if (index === 0) {
                    $card.trigger('click');
                }
            });
        })
        .catch(err => {
            console.error("🚨 Critical Error reaching api/get_blueprints.php pipeline:", err);
            $previewViewport.empty();
            window.dom.create('error-notice', $previewViewport, {
                tag: 'div',
                text: '❌ Network pipeline error loading document repositories. Verify API files.'
            });
        });
}
