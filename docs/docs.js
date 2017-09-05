import React from 'react';
import ReactDOM from 'react-dom';
import ImageFilter from '../source/index';
import './docs.scss';

const NONE = [
  1, 0, 0, 0, 0,
  0, 1, 0, 0, 0,
  0, 0, 1, 0, 0,
  0, 0, 0, 1, 0,
];

const Example = class extends React.Component {
  constructor() {
    super();

    const values = [...NONE];

    const labels = [
      'Red to Red',
      'Green to Red',
      'Blue to Red',
      'Alpha to Red',
      'Add to Red',
      'Red to Green',
      'Green to Green',
      'Blue to Green',
      'Alpha to Green',
      'Add to Green',
      'Red to Blue',
      'Green to Blue',
      'Blue to Blue',
      'Alpha to Blue',
      'Add to Blue',
      'Red to Alpha',
      'Green to Alpha',
      'Blue to Alpha',
      'Alpha to Alpha',
      'Add to Alpha',
    ];

    this.state = {
      values,
      labels,
      filter: values,
      applyFilter: true,
      colorOne: null,
      colorTwo: null,
      key: new Date().getTime(),
    };

    this.handleToggleFilter = this.handleToggleFilter.bind(this);
  }

  handleChange(index, value) {
    const {
      values,
    } = this.state;

    const newValues = [...values];
    newValues[index] = value;

    this.setState({
      values: newValues,
      filter: newValues,
    });
  }

  handleToggleFilter() {
    const { applyFilter } = this.state;

    this.setState({
      applyFilter: !applyFilter,
    });
  }

  renderSliders() {
    const {
      values,
      labels,
    } = this.state;

    return values.map((value, index) => {
      return (
        <div className='Control' key={ index }>
          { labels[index] }: { parseFloat(value).toFixed(2) }
          <input
            className='Control-input'
            type='range'
            min={ -1 }
            max={ 2 }
            step={ 0.1 }
            value={ value }
            onChange={ (e) => this.handleChange(index, e.target.value) }
          />
        </div>
      );
    });
  }

  render() {
    const {
      filter,
      applyFilter,
      values,
      colorOne,
      colorTwo,
      key,
    } = this.state;

    return (
      <div className='Content'>
        <div className='ImageWrapper'>
          <ImageFilter
            // image={ 'https://amazingslider.com/wp-content/uploads/2012/12/dandelion.jpg' }
            image={ `https://source.unsplash.com/random/1200x800?time=${ key }` }
            key={ key }
            // preserveAspectRatio='cover'
            // style={ { width: '100%', height: 300 } }
            filter={ applyFilter ? filter : NONE }
            colorOne={ colorOne }
            colorTwo={ colorTwo }
            onChange={ (m) => this.setState({ values: m }) }
          />
        </div>
        <div className='Controls'>
          { this.renderSliders() }
        </div>

        <div>
          <h4>Presets</h4>
          <button
            className='btn btn-sm'
            onClick={ () => this.setState({ filter: NONE, values: NONE, applyFilter: true }) }
          >
            None
          </button>
          <button
            className='btn btn-sm'
            onClick={ () => this.setState({ filter: 'invert', applyFilter: true }) }
          >
            Invert
          </button>
          <button
            className='btn btn-sm'
            onClick={ () => this.setState({ filter: 'grayscale', applyFilter: true }) }
          >
            Grayscale
          </button>
          <button
            className='btn btn-sm'
            onClick={ () => this.setState({ filter: 'sepia', applyFilter: true }) }
          >
            Sepia
          </button>
          <button
            className='btn btn-sm'
            onClick={ () => this.setState({
              applyFilter: true,
              filter: 'duotone',
              colorOne: [250, 50, 50],
              colorTwo: [20, 20, 100],
            }) }
          >
            Duotone (red / blue)
          </button>
          <button
            className='btn btn-sm'
            onClick={ () => this.setState({
              applyFilter: true,
              filter: 'duotone',
              colorOne: [50, 250, 50],
              colorTwo: [250, 20, 220],
            }) }
          >
            Duotone (green / purple)
          </button>
          <button
            className='btn btn-sm'
            onClick={ () => this.setState({
              applyFilter: true,
              filter: 'duotone',
              colorOne: [40, 250, 250],
              colorTwo: [250, 150, 30],
            }) }
          >
            Duotone (light blue/orange)
          </button>
          <button
            className='btn btn-sm'
            onClick={ () => this.setState({
              filter: 'duotone',
              colorOne: [40, 70, 200],
              colorTwo: [220, 30, 70],
            }) }
          >
            Duotone (blue / red)
          </button>
        </div>

        <h4>Misc</h4>

        <button
          className='btn btn-sm'
          onClick={ this.handleToggleFilter }
        >
          Turn filter { applyFilter ? 'off' : 'on' }
        </button>
        <button
          className='btn btn-sm'
          onClick={ () => this.setState({ key: new Date().getTime() }) }
        >
          New image
        </button>

        <div className='margin-bottom-20'>
          <small>Please note that Unsplash will sometime return the same image.</small>
        </div>

        <h4>Applied props</h4>
        { typeof filter === 'object' ?
          <pre>
          const filter = [<br />
            {'  '}{ values[0] }, { values[1] }, { values[2] }, { values[3] }, { values[4] },<br />
            {'  '}{ values[5] }, { values[6] }, { values[7] }, { values[8] }, { values[9] },<br />
            {'  '}{ values[10] }, { values[11] }, { values[12] }, { values[13] }, { values[14] },<br />
            {'  '}{ values[15] }, { values[16] }, { values[17] }, { values[18] }, { values[19] },<br />
          ];
          </pre> :
          <pre>
            const filter = '{ filter }';<br />
            { filter === 'duotone' &&
              <span>
                const colorOne = [{ colorOne[0] }, { colorOne[1] }, { colorOne[2] }];<br />
                const colorTwo = [{ colorTwo[0] }, { colorTwo[1] }, { colorTwo[2] }];
              </span> }
          </pre> }
      </div>
    );
  }
};


ReactDOM.render(<Example />, document.getElementById('demo'));
