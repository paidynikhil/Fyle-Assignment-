// Import necessary functions to be tested
const { validateInput, showError, formatNumberWithCommas } = require('../script.js');

// Test input validation function (validateInput)
describe('validateInput function', () => {
  test('should return true for valid numeric input', () => {
    expect(validateInput({ value: '50000' })).toBe(true);
  });

  test('should return false for non-numeric input', () => {
    expect(validateInput({ value: 'abc' })).toBe(false);
  });

  test('should return false for empty input', () => {
    expect(validateInput({ value: '' })).toBe(false);
  });
});

// Test error display function (showError)
describe('showError function', () => {
  test('should display error message in DOM element', () => {
    const errorMessage = 'Invalid income value.';
    const errorDisplay = document.createElement('div');
    errorDisplay.id = 'errorDisplay';
    document.body.appendChild(errorDisplay);

    showError(errorMessage);

    expect(errorDisplay.textContent).toBe(errorMessage);

    // Clean up after test
    document.body.removeChild(errorDisplay);
  });
});

// Test tax calculation and modal display on form submission
describe('Tax calculation and modal display', () => {
  // Mock DOM elements needed for form submission
  document.body.innerHTML = `
    <div class="container">
      <form id="taxForm">
        <input type="text" id="income" value="1000000">
        <input type="text" id="extraIncome" value="20000">
        <input type="text" id="deductions" value="50000">
        <select id="age"><option value="<40">&lt;40</option></select>
        <button type="submit">Submit</button>
      </form>
    </div>
    <div id="modal" class="modal"></div>
  `;

  // Mock modal display function
  const modalMock = { style: { display: 'none' } };
  const showModalSpy = jest.spyOn(document, 'getElementById').mockReturnValue(modalMock);

  // Mock formatNumberWithCommas function
  jest.mock('../script.js', () => ({
    ...jest.requireActual('../script.js'),
    formatNumberWithCommas: jest.fn((number) => number.toLocaleString('en-IN'))
  }));

  const { handleInput } = require('../script.js');

  test('should calculate tax and display modal with correct content', () => {
    const incomeInput = document.getElementById('income');
    handleInput(incomeInput);

    const submitButton = document.querySelector('button[type="submit"]');
    submitButton.click();

    // Verify modal display
    expect(modalMock.style.display).toBe('block');

    // Verify modal content (mocked tax calculation)
    const modalContent = document.getElementById('modal').innerHTML;
    expect(modalContent).toContain('10,52,000'); // Assuming tax amount is calculated to be 10,52,000
  });

  // Clean up after tests
  afterAll(() => {
    jest.restoreAllMocks();
  });
});
