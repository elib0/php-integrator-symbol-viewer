'use babel';

import _ from 'lodash';

var createBullet = (character) => {
    var container = document.createElement('div');
    container.classList.add('bullet-container');
    var content = document.createElement('div');
    content.classList.add('bullet-content');
    content.textContent = character;
    container.appendChild(content);
    return container;
};

var goToClassElement = (element) => () => {
    var options = {
        initialLine: parseInt(element.declaringStructure.startLineMember) - 1
    };
    atom.workspace.open(element.declaringStructure.filename, options);
};

module.exports = function ClassInfoView(classInfoModel) {
    var classInfoElement = document.createElement('div');
    classInfoElement.classList.add('php-integrator-symbol-viewer');

    var filterTextEditorContainer = document.createElement('div');
    filterTextEditorContainer.classList.add('php-integrator-symbol-viewer-input-container');
    var filterTextEditor = atom.workspace.buildTextEditor({ mini: true });
    filterTextEditor.setPlaceholderText('Search...')
    filterTextEditor.onDidStopChanging(() => {
        var searchedText = filterTextEditor.getText();
        var listElements = classInfoElement.querySelectorAll('.php-integrator-sub-list li');
        if(searchedText) {
            [].forEach.call(listElements, (element) => {
                var symbolName = element.querySelector('span');
                if(symbolName.textContent.toLowerCase().indexOf(searchedText.toLowerCase()) == -1) {
                    element.style.display = 'none';
                }
            });
        } else {
            [].forEach.call(listElements, (element) => {
                element.style.display = 'list-item';
            });

        }
    });
    filterTextEditorContainer.appendChild(atom.views.getView(filterTextEditor));
    classInfoElement.appendChild(filterTextEditorContainer);

    var classHeaderElement = document.createElement('div')
    classHeaderElement.classList.add('php-integrator-class-header');
    classHeaderTypeElement = document.createElement('span');
    classHeaderTypeElement.textContent = classInfoModel.type;
    classHeaderNameElement = document.createElement('span');
    classHeaderNameElement.classList.add('php-header-name');
    classHeaderNameElement.textContent = classInfoModel.shortName;
    classHeaderElement.appendChild(classHeaderTypeElement);
    classHeaderElement.appendChild(classHeaderNameElement);
    classInfoElement.appendChild(classHeaderElement);

    var subListContainer = document.createElement('div');
    subListContainer.classList.add('php-integrator-sub-list-container');

    var constantsList = document.createElement('ul')
    constantsList.classList.add('php-integrator-sub-list')
    constantsList.classList.add('php-integrator-constants-sub-list')
    _.each(classInfoModel.constants, (constant) => {
        var constantsListElement = document.createElement('li')
        constantsListElement.appendChild(createBullet('C'))
        constantsListElement.onclick = goToClassElement(constant)
        var constantsListElementTextContent = document.createElement('span')
        constantsListElementTextContent.textContent = constant.name;
        constantsListElement.appendChild(constantsListElementTextContent)
        constantsList.appendChild(constantsListElement)
        subListContainer.appendChild(constantsList)
    });

    var staticPropertieslist = document.createElement('ul')
    staticPropertieslist.classList.add('php-integrator-static-properties-sub-list')
    staticPropertieslist.classList.add('php-integrator-sub-list')
    _.each(classInfoModel.staticProperties, (staticProperty) => {
        var staticPropertiesListElement = document.createElement('li')
        staticPropertiesListElement.appendChild(createBullet('S'))
        staticPropertiesListElement.onclick = goToClassElement(staticProperty)
        var staticPropertiesListElementTextContent = document.createElement('span')
        staticPropertiesListElementTextContent.textContent = staticProperty.name
        if(staticProperty.isPublic) {
            staticMethodsListElementTextContent.classList.add('php-public')
        }
        staticPropertiesListElement.appendChild(staticPropertiesListElementTextContent)
        staticPropertieslist.appendChild(staticPropertiesListElement)
        subListContainer.appendChild(staticPropertieslist)
    });

    var staticMethodsList = document.createElement('ul')
    staticMethodsList.classList.add('php-integrator-static-methods-sub-list')
    staticMethodsList.classList.add('php-integrator-sub-list')
    _.each(classInfoModel.staticMethods, (staticMethod) => {
        var staticMethodsListElement = document.createElement('li')
        staticMethodsListElement.appendChild(createBullet('S'))
        staticMethodsListElement.onclick = goToClassElement(staticMethod)
        var staticMethodsListElementTextContent = document.createElement('span')
        staticMethodsListElementTextContent.textContent = staticMethod.name
        if(staticMethod.isPublic) {
            staticMethodsListElementTextContent.classList.add('php-public')
        }
        staticMethodsListElement.appendChild(staticMethodsListElementTextContent)
        staticMethodsList.appendChild(staticMethodsListElement)
        subListContainer.appendChild(staticMethodsList)
    });

    var propertiesList = document.createElement('ul')
    propertiesList.classList.add('php-integrator-sub-list')
    propertiesList.classList.add('php-integrator-properties-sub-list')
    _.each(classInfoModel.properties, (property) => {
        var propertiesListElement = document.createElement('li')
        propertiesListElement.appendChild(createBullet('P'))
        propertiesListElement.onclick = goToClassElement(property)
        var propertiesListElementTextContent = document.createElement('span')
        propertiesListElementTextContent.textContent = property.name;
        propertiesListElement.appendChild(propertiesListElementTextContent)
        propertiesList.appendChild(propertiesListElement)
        subListContainer.appendChild(propertiesList)
    });

    var methodsList = document.createElement('ul')
    methodsList.classList.add('php-integrator-methods-sub-list')
    methodsList.classList.add('php-integrator-sub-list')
    _.each(classInfoModel.methods, (method) => {
        var methodsListElement = document.createElement('li')
        methodsListElement.appendChild(createBullet('M'))
        methodsListElement.onclick = goToClassElement(method)
        var methodsListElementTextContent = document.createElement('span')
        methodsListElementTextContent.textContent = method.name;
        if(method.isPublic) {
            methodsListElementTextContent.classList.add('php-public')
        }
        methodsListElement.appendChild(methodsListElementTextContent)
        methodsList.appendChild(methodsListElement)
        subListContainer.appendChild(methodsList)
    });

    classInfoElement.appendChild(subListContainer);

    return classInfoElement;
}