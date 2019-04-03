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
                        closeModalButton.addEventListener('click', () => {
                            closeModalButton.setAttribute('tabindex', '-1')
                        })
                    }
                }
            })
        }
    })
}
