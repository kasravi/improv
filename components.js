class MySlider extends HTMLElement {
    constructor() {
      super();

      // Create shadow DOM
      this.attachShadow({ mode: 'open' });

      // Set up initial attributes
      this._min = this.getAttribute('min') || 0;
      this._max = this.getAttribute('max') || 100;
      this._resolution = this.getAttribute('res') || 1;
      this._text = this.getAttribute('text') || "";

      // Initial value
      this._value = this.getAttribute('value') || this._min;

      // Render the component
      this.render();
      this.setInitialPosition();

    }

    connectedCallback() {
      this.addEventListener('touchmove', this.handleTouchMove.bind(this));
    }

    handleTouchMove(event) {
      event.preventDefault();
      const touch = event.touches[0];
      const position = touch.clientY - this.getBoundingClientRect().top;
      this.updateSlider(position);
    }

    setInitialPosition() {
        const initialValue = this._value|| this._min;
        const percentage = (initialValue - this._min) / (this._max - this._min) * 100;
    
        this._value = Math.min(Math.max(initialValue, this._min), this._max);
    
        const barHeight = (this._value / this._max) * 100;
        this.shadowRoot.querySelector('.slider-bar').style.height = `${barHeight}%`;
    
        this.shadowRoot.querySelector('.slider-value').textContent = this._value;
      }

    updateSlider(position) {
        const percentage = (position / this.clientHeight) * 100;
        const invertedValue = this._max - Math.round((percentage * (this._max - this._min) / 100) / this._resolution) * this._resolution;
      
        this._value = Math.min(Math.max(invertedValue, this._min), this._max);
      
        const barHeight = (this._value / this._max) * 100;
        this.shadowRoot.querySelector('.slider-bar').style.height = `${barHeight}%`;
      
        this.shadowRoot.querySelector('.slider-value').textContent = this._value;
      
        // Dispatch the change event
        this.dispatchEvent(new Event('change', { bubbles: true }));
      }
      
      

    render() {
      // Create the shadow DOM content
      this.shadowRoot.innerHTML = `
        <style>
          /* Styles for the shadow DOM */
          :host {
            display: block;
            position: relative;
            overflow: hidden;
            border: solid 1px white;
          }

          .slider-bar {
            width: 100%;
            height: 100%;
            background-color: #999;
            position: absolute;
            bottom: 0;
            transition: height 0.3s;
          }

          .slider-value {
            position: absolute;
            bottom: 0;
            width: 100%;
            text-align: center;
            font-size: 20px;
            color: #000;
            pointer-events: none;
          }
          .slider-text {
            position: absolute;
            bottom: 50%;
            width: 100%;
            text-align: center;
            font-size: 10px;
            color: #000;
            pointer-events: none;
          }
        </style>
        <div class="slider-bar"></div>
        <div class="slider-text">${this._text}</div>
        <div class="slider-value">${this._value}</div>
      `;
    }
  }

  // Define the custom element
  customElements.define('my-slider', MySlider);