# MMM-WebUntis
A MagicMirror² module to display WebUntis timetables. 

## Dependencies

- [webuntis](https://www.npmjs.com/package/webuntis)

## Installation
1. Navigate to the `/modules` folder of you MagicMirror²
2. Clone this repository using the following command: `git clone https://github.com/amonelias/MMM-WebUntis.git`
3. Navigate to the `/MMM-WebUntis` folder and install dependencies using the following command: `npm install`

## Config
<table>
  <thead>
    <tr>
      <th>Option</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>refreshTime</code></td>
      <td><strong>Default: 100000</strong><br>Time interval to refresh data in miliseconds<br><br>
          <strong>Type:</strong> <code>number</code>
      </td>
    </tr>
    <tr>
      <td><code>url</code></td>
      <td>WebUntis URL of the school<br><br><strong>Type:</strong> <code>string</code></td>
    </tr>
    <tr>
      <td><code>school</code></td>
      <td>Name of the school<br><br><strong>Type:</strong> <code>string</code></td>
    </tr>
    <tr>
      <td><code>class</code></td>
      <td>Name of the class<br><br><strong>Type:</strong> <code>string</code></td>
    </tr>
    <tr>
      <td><code>days</code></td>
      <td><strong>Default: 1</strong><br>Days to fetch and display starting from the current day<br><br>
          <strong>Type:</strong> <code>number</code>
      </td>
    </tr>
    <tr>
      <td><code>dateformat</code></td>
      <td><strong>Default: "en-EN"</strong><br>Format of the displayed dates<br><br><strong>Type:</strong> <code>string</code></td>
    </tr>
    <tr>
      <td><code>timeformat</code></td>
      <td><strong>Default: "en-DE"</strong><br>Format of the displayed times<br><br><strong>Type:</strong> <code>string</code></td>
    </tr>
  </tbody>
</table>

To use this module, add it to the modules array in the `config/config.js` file:
```javascript
  {
    module: 'MMM-WebUntis',
    position: 'top_right', // any possible region
    config: {
      refreshTime: 100000,
      url: "",
      school: "",
      class: "",
      days: 1,
      dateformat: "en-EN",
      timeformat: "en-DE",
    },
  },
```

## Update
Navigate to the folder of the module in the `/modules` folder and get the latest version using the command `git pull`.
