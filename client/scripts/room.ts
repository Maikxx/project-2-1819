(() => {
    function featureExists(feature: string, where: any, type?: string) {
        return feature in where
            && type ?
                typeof where[feature] === type
                : true
    }

    if (
        featureExists('querySelectorAll', document.body, 'function')
        && featureExists('forEach', Array.prototype, 'function')
        && featureExists('addEventListener', document.body, 'function')
        && featureExists('setAttribute', document.body, 'function')
        && featureExists('hash', window.location, 'string')
        && featureExists('replace', String.prototype, 'function')
        && featureExists('removeAttribute', document.body, 'function')
    ) {
        const modals: NodeListOf<Element> = document.querySelectorAll('.Modal')

        turnOffTabIndexForOffScreenElements(modals)
        activateTabIndexOnHashChange(modals)
    }

    function turnOffTabIndexForOffScreenElements(modals: NodeListOf<Element>) {
        if (modals && modals.length > 0) {
            modals.forEach((modal: Element) => {
                const interactiveElements: NodeListOf<Element> = modal.querySelectorAll('button, a, input, textarea')

                if (interactiveElements && interactiveElements.length > 0) {
                    interactiveElements.forEach((interactiveElement: Element) => {
                        interactiveElement.setAttribute('tabindex', '-1')
                    })
                }
            })
        }
    }

    function activateTabIndexOnHashChange(modals: NodeListOf<Element>) {
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash
            const pageOffset = getCurrentScrollOffset()

            if (hash && hash.length > 0) {
                modals.forEach((modal: Element) => {
                    const id = hash.replace('#', '')

                    if (modal.id === id) {
                        const interactiveElements: NodeListOf<Element> = modal.querySelectorAll('button, a, input, textarea')
                        const closeModalButton: Element = modal.querySelector('.Modal__close-button')

                        if (interactiveElements && interactiveElements.length > 0) {
                            interactiveElements.forEach((interactiveElement: Element) => {
                                interactiveElement.removeAttribute('tabindex')
                            })
                        }

                        if (closeModalButton) {
                            closeModalButton.addEventListener('click', event => {
                                // This is done to create the same experience as with pressing the escape key.
                                event.preventDefault()
                                window.location.hash = '#'

                                if (typeof pageOffset === 'number') {
                                    window.scrollTo(0, pageOffset)
                                }

                                closeModalButton.setAttribute('tabindex', '-1')
                            })
                        }
                    }
                })

                window.addEventListener('keydown', ({ key }) => {
                    const { hash } = window.location
                    const isModalOpen = hash && hash.length > 0 && hash !== '#'
                    const escapeKeyIsPressed = typeof key === 'string' && (key === 'Esc' || key === 'Escape')

                    if (isModalOpen && escapeKeyIsPressed) {
                        window.location.hash = '#'

                        if (typeof pageOffset === 'number') {
                            window.scrollTo(0, pageOffset)
                        }
                    }
                })
            }
        })
    }

    function getCurrentScrollOffset() {
        return featureExists('scrollY', window, 'number')
            ? window.scrollY
            : featureExists('pageYOffset', window, 'number')
                ? window.pageYOffset
                : null
    }
})()
