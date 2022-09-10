import VerticalLayout from './VerticalLayout.js';
import ErrorPage from './ErrorPage.js';
import LoadingPage from './LoadingPage.js';

import Actions from './Actions.js';

const row = (bill) => {
  return `
    <tr>
      <td>${bill.type}</td>
      <td>${bill.name}</td>
      <td>${bill.date}</td>
      <td>${bill.amount} €</td>
      <td>${bill.status}</td>
      <td>
        ${Actions(bill.fileUrl)}
      </td>
    </tr>
    `;
};

const rows = (data) => {
  return data && data.length
    ? data
        .sort((b, a) => {
          // / Turn strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          //descending sort logic
          // 2000 - 2001 = -1
          // 2002 - 2002 = 0
          // 2003 - 2002 = 1
          return new Date(b.date) - new Date(a.date);
        })
        .map((bill) => row(bill))
        .join('')
    : '';
};

// i will use this { data: bills, loading, error } in /tests/bills
// for views/Bills component: increase coverage to 100%
export default ({ data: bills, loading, error }) => {
  const modal = () => `
    <div class="modal fade" id="modaleFile" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Fee</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
          </div>
        </div>
      </div>
    </div>
  `;

  if (loading) {
    // if loading:true show the LoadingPage
    // cover LoadingPage()  for views/Bills component: increase coverage to 100% + 1 tests passed
    return LoadingPage();
  } else if (error) {
    // if error show error
    //cover ErrorPage()  for views/Bills component: increase coverage to 100% + 1 tests passed
    return ErrorPage(error);
  }

  return `
    <div class='layout'>
      ${VerticalLayout(120)}
      <div class='content'>
        <div class='content-header'>
          <div class='content-title'> My fees </div>
          <button type="button" data-testid='btn-new-bill' class="btn btn-primary">New fee</button>
        </div>
        <div id="data-table">
        <table id="example" class="table table-striped" style="width:100%">
          <thead>
              <tr>
                <th>Category</th>
                <th>Label</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
          </thead>
          <tbody data-testid="tbody">
            ${rows(bills)}
          </tbody>
          </table>
        </div>
      </div>
      ${modal()}
    </div>`;
};
