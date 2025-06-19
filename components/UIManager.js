import * as DigitalBaconUI from 'DigitalBacon-UI';
import { UI_DATA } from '../utils/constants.js';

export class UIManager {

  constructor(threeManager, onScaleChange, onClick, onRangeChange) {
    DigitalBaconUI.InputHandler.enableXRControllerManagement(threeManager.scene);

    this.onScaleChange = onScaleChange;
    this.onClick = onClick;
    this.onRangeChange = onRangeChange;

    this.uiData = UI_DATA;

    this.textElements = {};

    this.init(threeManager).then(() => {
      console.log("UIManager initialized")
      this.addControls();
    }).catch(err => console.log(err));
  }

  async init(threeManager) {
    await DigitalBaconUI.init(threeManager.container, threeManager.renderer, threeManager.scene, threeManager.camera);
    this.body = new DigitalBaconUI.Body({
      borderRadius: 0.05,
      borderWidth: 0.005,
      height: 1.3,
      padding: 0.01,
      justifyContent: 'start',
      // materialColor: 0x000000,
      // opacity: 0.2,
      glassmorphism: true,
      width: 2,
      overflow: 'scroll',
      alignItems: 'center'
    });

    this.body.position.set(0, 1.7, -1);
    //this.body.scale.set(0.1, 0.1, 0.1);

    this.parent = [];
    this.parent.push(this.body);

    this.body.pointerInteractable.addEventListener('up', (event, value) => {
      console.log('up', event, value)
      threeManager.scene.attach(this.body)
    })

    this.body.onDrag = ((value) => {
      console.log('dragging', value)
      value.owner.object.attach(this.body);
    })

    threeManager.scene.add(this.body)
  }

  addControls() {
    // this.body.children[0].children.forEach(child => this.body.children[0].remove(child))
    this.textElements = {}
    this.body.children[0].clear();
    console.log('Body', this.body)

    this.uiData.forEach(item => this.addItem(item))
  }

  addTabs(item) {

    const tabContainer = new DigitalBaconUI.Span(styles.tabGroup);
    this.body.add(tabContainer);

    item.options.forEach(option => {
      const tabButton = this.createTabButton(option.name, option.selected);
      tabContainer.add(tabButton);

      tabButton.onClick = () => {
        item.options.forEach(option => option.selected = false);
        option.selected = true;

        this.addControls();
      }

      if (option.selected) {
        option.options.forEach(option => this.addItem(option))
      }
    });

  }

  createTabButton(name, selected) {
    const button = new DigitalBaconUI.Div({ ...styles.tabButton, materialColor: selected ? 0x1db954 : 0x000, backgroundVisible: selected });

    const text = new DigitalBaconUI.Text(name,
      { color: 0xffffff, fontSize: 0.075 })

    button.add(text)

    return button;
  }

  addGroup(item) {
    const groupContainer = new DigitalBaconUI.Span(styles.group);

    this.parent.push(groupContainer);
    item.options.forEach(option => this.addItem(option))

    this.parent.pop();

    this.parent[this.parent.length - 1].add(groupContainer);
  }

  addRadio(item) {
    item.options.forEach(option => {
      const radioButton = this.createRadioButton(option.text, option.name, option.action);
      this.parent[this.parent.length - 1].add(radioButton);
    })
  }

  createRadioButton(text, name, action) {
    const radioContainer = new DigitalBaconUI.Span();
    const radio = new DigitalBaconUI.Radio(name, { marginRight: 0.02 });
    radioContainer.add(radio);
    radioContainer.add(new DigitalBaconUI.Text(text, { color: 0xffffff, fontSize: 0.075, marginRight: 0.05 }));

    return radioContainer;
  }

  addSelect(item) {
    const select = new DigitalBaconUI.Select({ width: item.width, marginRight: 0.05, paddingRight: 0.03 });
    select.addOptions(...item.options);
    select.maxDisplayOptions = 3;
    select.onChange = (value) => {
      this.onScaleChange(item.name, value);
    }
    this.parent[this.parent.length - 1].add(select);
  }

  addRange(item) {
    const range = new DigitalBaconUI.Range({ width: item.width, marginRight: 0.05, paddingRight: 0.03 });
    range.onChange = this.onRangeChange
    this.parent[this.parent.length - 1].add(range);
  }

  addButton(item) {
    const button = new DigitalBaconUI.Div({ width: 'auto', backgroundVisible: true, materialColor: 0x111, marginRight: 0.05, paddingTop: 0.03, paddingBottom: 0.03, paddingLeft: 0.09, paddingRight: 0.09, borderRadius: 0.05, justifyContent: 'center', });
    // button.onClick = this.onScaleChange

    const text = new DigitalBaconUI.Text(item.text, { color: 0xffffff, fontSize: 0.075, })
    button.add(text);


    this.textElements[item.action] = text

    button.onClick = () => {

      if (item.action === 'play_progression') {
        // text
      }

      this.onClick(item.action);
    };
    button.pointerInteractable.addHoveredCallback((hovered) => {
      console.log('hovered', hovered)
      button.materialColor = hovered ? 0x1db954 : 0x111
    });

    this.parent[this.parent.length - 1].add(button);
  }

  addItem(item) {
    switch (item.type) {
      case 'tabs':
        this.addTabs(item);
        break;
      case 'text':
        this.parent[this.parent.length - 1].add(new DigitalBaconUI.Text(item.text, { color: 0xffffff, fontSize: 0.075, marginRight: 0.2 }))
        break;
      case 'group':
        this.addGroup(item);
        break;
      case 'button':
        this.addButton(item);
        break;
      case 'range':
        this.addRange(item)
        break;
      case 'radio':
        this.addRadio(item);
        break;
      case 'select':
        this.addSelect(item);
        break;
    }
  }
}

const styles = {
  tabGroup: {
    backgroundVisible: true,
    borderRadius: 0.05,
    height: 0.2,
    justifyContent: 'start',
    marginBottom: 0.1,
    materialColor: 0x000,
    width: 1.98,
    opacity: 0.1,
  },
  tabButton: {
    backgroundVisible: false,
    height: 0.2,
    borderRadius: 0.05,
    justifyContent: 'center',
    materialColor: 0x1db954,
    width: '49.9%',
  },
  group: {
    backgroundVisible: true,
    borderRadius: 0.05,
    height: 'auto',
    justifyContent: 'start',
    padding: 0.05,
    marginBottom: 0.02,
    materialColor: 0x000000,
    width: '90%',
    opacity: 0.2,
  }
}