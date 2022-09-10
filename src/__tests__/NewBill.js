import {
  screen,
  fireEvent,
  waitForElementToBeRemoved,
} from '@testing-library/dom';
import { localStorageMock } from '../__mocks__/localStorage.js';
import NewBillUI from '../views/NewBillUI.js';
import NewBill from '../containers/NewBill.js';
import BillsUI from '../views/BillsUI.js';
import firestore from '../app/Firestore';
import firebase from '../__mocks__/firebase';
import { ROUTES, ROUTES_PATH } from '../constants/routes';

jest.mock('../app/Firestore');

// Jest Mock Functions
// Mock functions are also known as "spies", because they let you spy on the behavior of a function that is called indirectly by some other code, rather than just testing the output. You can create a mock function with jest.fn().

describe('Given I am connected as an employee', () => {
  describe('When I am on NewBill Page and I add an image file', () => {
    test('Then this new file should have been changed in the input file', () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        'user',
        JSON.stringify({
          type: 'Employee',
        })
      );
      const html = NewBillUI();
      document.body.innerHTML = html;

      const newBill = new NewBill({
        document,
        onNavigate,
        firestore: null,
        localStorage: window.localStorage,
      });
      const handleChangeFile = jest.fn(newBill.handleChangeFile);
      const inputFile = screen.getByTestId('file');
      inputFile.addEventListener('change', handleChangeFile);
      fireEvent.change(inputFile, {
        target: {
          files: [new File(['image.png'], 'image.png', { type: 'image/png' })],
        },
      });
      expect(handleChangeFile).toHaveBeenCalled();
      expect(inputFile.files[0].name).toBe('image.png');
    });
  });
});

describe('Given I am connected as an employee', () => {
  describe('When I am on NewBill Page and I submit the form width an image (jpg, jpeg, png)', () => {
    test('Then it should create a new bill', () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        'user',
        JSON.stringify({
          type: 'Employee',
        })
      );
      const firestore = null;
      const html = NewBillUI();
      document.body.innerHTML = html;

      const newBill = new NewBill({
        document,
        onNavigate,
        firestore,
        localStorage: window.localStorage,
      });
      const handleSubmit = jest.fn(newBill.handleSubmit);
      const submitBtn = screen.getByTestId('form-new-bill');
      submitBtn.addEventListener('submit', handleSubmit);
      fireEvent.submit(submitBtn);
      expect(handleSubmit).toHaveBeenCalled();
    });
  });
});

describe('Given I am connected as an employee', () => {
  describe('When I am on NewBill Page and I add a file other than an image (jpg, jpeg or png)', () => {
    test("Then, the bill shouldn't be created and I stay on the NewBill page", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        'user',
        JSON.stringify({
          type: 'Employee',
        })
      );
      const firestore = null;
      const html = NewBillUI();
      document.body.innerHTML = html;

      const newBill = new NewBill({
        document,
        onNavigate,
        firestore,
        localStorage: window.localStorage,
      });
      const handleSubmit = jest.fn(newBill.handleSubmit);
      newBill.fileName = 'invalid';
      const submitBtn = screen.getByTestId('form-new-bill');
      submitBtn.addEventListener('submit', handleSubmit);
      fireEvent.submit(submitBtn);
      expect(handleSubmit).toHaveBeenCalled();
      expect(screen.getAllByText('My fees')).toBeTruthy();
    });
  });
});
// Post NewBill integration test
describe('Given I am a user connected as an Employees', () => {
  describe('When I fill a new bill', () => {
    test('fetches new bill to mock API Post', async () => {
      const getSpy = jest.spyOn(firebase, 'get');
      const bills = await firebase.get();
      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(bills.data.length).toBe(4);
    });
    test('fetches new bill from an API and fails with 404 message error', async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error('Erreur 404'))
      );
      const html = BillsUI({ error: 'Erreur 404' });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 404/);
      expect(message).toBeTruthy();
    });
    test('fetches messages from an API and fails with 500 message error', async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error('Erreur 500'))
      );
      const html = BillsUI({ error: 'Erreur 500' });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 500/);
      expect(message).toBeTruthy();
    });
  });
});
