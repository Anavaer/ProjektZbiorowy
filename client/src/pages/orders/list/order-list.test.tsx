import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import moment from "moment";
import { OrderList } from "pages";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { mockServicePriceList } from "__mocks__/admin";
import { mockOrderList } from "__mocks__/order";


const mockedNavigate = jest.fn();

jest.mock("axios");
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate
}));

const mockAxios = axios as jest.Mocked<typeof axios>;



describe("OrderListTest", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    mockAxios.get.mockImplementation(url => {
      switch(url) {
        case "/api/orders":
          return Promise.resolve({ data: mockOrderList });
        case "/api/admin/services":
          return Promise.resolve({ data: mockServicePriceList });
        default:
          return Promise.reject(new Error("Unexpected"));
      }
    });

    mockAxios.post.mockImplementation(url => {
      switch(url) {
        case "/api/orders/create":
          return Promise.resolve({ status: 201 });
        default:
          return Promise.reject(new Error("Unexpected"));
      }
    })
  });

  afterEach(() => {
    mockAxios.get.mockClear();
    mockAxios.post.mockClear();
    document.cookie = "";
  });







  test("Should render correctly", async () => {
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "token=test-token"
    });

    render(
      <MemoryRouter initialEntries={["/orders"]}>
        <Routes>
          <Route path="orders" element={<OrderList />} />
        </Routes>
      </MemoryRouter>
    );

    const orderListHeader = await screen.findByRole("order-list-header");
    const orderItems = await screen.findAllByRole("order-item");

    expect(orderListHeader).toBeInTheDocument();
    expect(orderListHeader).toHaveTextContent("Zamówienia");
    expect(orderListHeader).toHaveTextContent("Łączna liczba zamówień: " + mockOrderList.length);
    expect(orderItems.length).toEqual(mockOrderList.length);
  });







  test("For missing token it should redirect to main page", async () => {
    render(
      <MemoryRouter initialEntries={["/orders"]}>
        <Routes>
          <Route path="orders" element={<OrderList />} />
        </Routes>
      </MemoryRouter>
    );


    expect(mockedNavigate).toHaveBeenCalledWith('/');
  });






  test("After button click it should open dialog", async () => {
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "token=test-token"
    });

    render(
      <MemoryRouter initialEntries={["/orders"]}>
        <Routes>
          <Route path="orders" element={<OrderList />} />
        </Routes>
      </MemoryRouter>
    );

    const orderListOpenDialogButton = await screen.findByRole("order-list-open-dialog-button");
    await act(() => Promise.resolve(fireEvent.click(orderListOpenDialogButton)));

    const orderListDialog = await screen.findByRole("order-list-dialog");
    expect(orderListDialog).toBeInTheDocument();
  });







  test("After clicking on service date button, it should add new service date", async () => {
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "token=test-token"
    });

    render(
      <MemoryRouter initialEntries={["/orders"]}>
        <Routes>
          <Route path="orders" element={<OrderList />} />
        </Routes>
      </MemoryRouter>
    );

    const orderListOpenDialogButton = await screen.findByRole("order-list-open-dialog-button");
    await act(() => Promise.resolve(fireEvent.click(orderListOpenDialogButton)));

    const orderListServiceDateAddButton = await screen.findByRole("order-list-service-date-add-button");
    const orderListFormFieldServiceDate = await screen.findByRole("order-list-form-field-service-date");
    const date: Date = moment(new Date()).add(1, 'minutes').toDate();

    fireEvent.change(orderListFormFieldServiceDate, { currentTarget: { value: date } });
    fireEvent.click(orderListServiceDateAddButton);

    const orderListServiceDate = await screen.queryAllByRole("order-list-service-date");

    expect(orderListServiceDate.length).toEqual(1);
    orderListServiceDate.forEach(elem => {
      expect(elem).toHaveTextContent(moment(date).locale("pl").format("DD MMM yyyy, HH:mm"));
    })
  });

  





  test("After clicking remove service date button, it should remove service date", async () => {
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "token=test-token"
    });

    render(
      <MemoryRouter initialEntries={["/orders"]}>
        <Routes>
          <Route path="orders" element={<OrderList />} />
        </Routes>
      </MemoryRouter>
    );

    const orderListOpenDialogButton = await screen.findByRole("order-list-open-dialog-button");
    await act(() => Promise.resolve(fireEvent.click(orderListOpenDialogButton)));

    const orderListServiceDateAddButton = await screen.findByRole("order-list-service-date-add-button");
    const orderListFormFieldServiceDate = await screen.findByRole("order-list-form-field-service-date");
    const date: Date = moment(new Date()).add(1, 'minutes').toDate();

    fireEvent.change(orderListFormFieldServiceDate, { currentTarget: { value: date } });
    fireEvent.click(orderListServiceDateAddButton);

    const orderListServiceDateDeleteButton = await screen.findByRole("order-list-service-date-delete-button");

    fireEvent.click(orderListServiceDateDeleteButton);

    const orderListServiceDate = await screen.queryAllByRole("order-list-service-date");

    expect(orderListServiceDate.length).toEqual(0);
  });







  test("After click on service price it should count total price", async () => {
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "token=test-token"
    });

    render(
      <MemoryRouter initialEntries={["/orders"]}>
        <Routes>
          <Route path="orders" element={<OrderList />} />
        </Routes>
      </MemoryRouter>
    );

    const orderListOpenDialogButton = await screen.findByRole("order-list-open-dialog-button");
    await act(() => Promise.resolve(fireEvent.click(orderListOpenDialogButton)));

    const orderListServicePrice = await screen.queryAllByRole("order-list-service-price");
    const orderListTotalPrice = await screen.findByRole("order-list-total-price");
    const orderListFormFieldArea = await (await screen.findByRole("order-list-form-field-area")).querySelector("input");

    [
      { inputArea: 0, outputArea: "0.00" },
      { inputArea: 10, outputArea: (mockServicePriceList[0].priceRatio * 10).toFixed(2) }
    ]
    .forEach(x => {
      fireEvent.change(orderListFormFieldArea!, { target: { value: x.inputArea } })
      fireEvent.click(orderListServicePrice[0]);

      expect(orderListTotalPrice).toHaveTextContent(`Łączna kwota: ${x.outputArea}zł`);
      fireEvent.click(orderListServicePrice[0]);
    });
  });








  test("After filling order form it should create new order", async () => {
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "token=test-token"
    });

    render(
      <MemoryRouter initialEntries={["/orders"]}>
        <Routes>
          <Route path="orders" element={<OrderList />} />
        </Routes>
      </MemoryRouter>
    );

    const orderListOpenDialogButton = await screen.findByRole("order-list-open-dialog-button");
    await act(() => Promise.resolve(fireEvent.click(orderListOpenDialogButton)));

    const orderListFormFieldServiceDate = await screen.findByRole("order-list-form-field-service-date");
    const orderListServiceDateAddButton = await screen.findByRole("order-list-service-date-add-button");
    const orderListServicePrice = await screen.queryAllByRole("order-list-service-price");
    const orderItemCreateOrderApprove = await screen.findByRole("order-item-create-order-approve");
    const date: Date = moment(new Date()).add(1, 'hours').toDate();

    await waitFor(() => {
      [
        { roleSuffix: "city", value: "test" },
        { roleSuffix: "address", value: "test" },
        { roleSuffix: "area", value: 10 }
      ]
        .forEach(async elem => {
          const input = await (await screen.findByRole("order-list-form-field-" + elem.roleSuffix)).querySelector("input");
          fireEvent.change(input!, { target: { value: elem.value } });
        });
    });

    fireEvent.change(orderListFormFieldServiceDate, { currentTarget: { value: date } });
    fireEvent.click(orderListServiceDateAddButton);

    fireEvent.click(orderListServicePrice[0]);

    expect(orderItemCreateOrderApprove).toBeEnabled();
    fireEvent.click(orderItemCreateOrderApprove);

    const orderListSnackbar = await screen.findByRole("order-list-snackbar");
    expect(orderListSnackbar).toBeInTheDocument();
    expect(orderListSnackbar).toHaveTextContent("Zamówienie zostało utworzone pomyslnie");
  });
});