import { fireEvent, render, screen } from "@testing-library/react";
import axios from "axios";
import moment from "moment";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { mockOrderItem } from "__mocks__/order";
import { mockOrderStatusList } from "__mocks__/order-status";
import { OrderDetails } from "./order-details";

const mockedNavigate = jest.fn();

jest.mock("axios");
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate
}));

const mockAxios = axios as jest.Mocked<typeof axios>;







describe("OrderDetailsTest", () => {

  beforeEach(() => {
    document.body.innerHTML = "";

    mockAxios.get.mockImplementation(url => {
      switch (url) {
        case "/api/orders/" + mockOrderItem.orderId:
          return Promise.resolve({ data: mockOrderItem });
        case "/api/orderStatus/orderstatuses":
          return Promise.resolve({ data: mockOrderStatusList })
        default:
          return Promise.reject(new Error("Not found"));
      }
    });
  });

  afterEach(() => {
    mockAxios.get.mockClear();
    document.cookie = "";
  });





  
  test("For correct param should render corectly", async () => {
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "token=test-token"
    });

    render(
      <MemoryRouter initialEntries={["/orders/" + mockOrderItem.orderId]}>
        <Routes>
          <Route path="orders/:id" element={<OrderDetails />} />
        </Routes>
      </MemoryRouter>
    );

    const orderDetailsContainer = await screen.findByRole("order-details-container");
    const orderEmployeeWidget = await screen.findByRole("order-employee-widget");
    const orderDetailsServiceDate = await screen.findByRole("order-details-service-date");
    const orderDetailsArea = await screen.findByRole("order-details-area");
    const orderStatusWidget = await screen.findByRole("order-status-widget");
    const orderDetailsServicePrices = await screen.findAllByRole("order-details-service-price");
    const orderDetailsTotalPrice = await screen.findByRole("order-details-total-price");
    const orderDetailsClientName = await screen.findByRole("order-details-client-name");
    const orderDetailsClientAddress = await screen.findByRole("order-details-client-address");
    const orderDetailsClientCompanyName = await screen.findByRole("order-details-client-company-name");
    const orderDetailsClientEmail = await screen.findByRole("order-details-client-email");
    const orderDetailsClientPhone = await screen.findByRole("order-details-client-phone");
    const orderDetailsClientNip = await screen.findByRole("order-details-client-nip");


    expect(orderDetailsContainer).toBeInTheDocument();
    expect(orderEmployeeWidget).toBeInTheDocument();
    expect(orderEmployeeWidget).toHaveTextContent("Nieprzypisany");
    expect(orderDetailsServiceDate).toBeInTheDocument();
    expect(orderDetailsServiceDate).toHaveTextContent(moment(mockOrderItem.serviceDate).locale("pl").format("DD MMMM yyyy, HH:mm:ss"));
    expect(orderDetailsServiceDate).toHaveTextContent("Data złożenia zamówienia");
    expect(orderDetailsArea).toBeInTheDocument();
    expect(orderDetailsArea).toHaveTextContent(mockOrderItem.area + "m2");
    expect(orderDetailsArea).toHaveTextContent("Powierzchnia apartamentu");
    expect(orderStatusWidget).toBeInTheDocument();
    expect(orderStatusWidget).toHaveTextContent(mockOrderItem.orderStatus.visibleText!);
    expect(orderDetailsServicePrices.length).toBe(mockOrderItem.services.length);

    for (let i = 0; i < mockOrderItem.services.length; i++) {
      expect(orderDetailsServicePrices[i]).toHaveTextContent(mockOrderItem.services[i].id + "");
      expect(orderDetailsServicePrices[i]).toHaveTextContent(mockOrderItem.services[i].description);
      expect(orderDetailsServicePrices[i]).toHaveTextContent((mockOrderItem.services[i].priceRatio * mockOrderItem?.area).toFixed(2) + "zł");
    }

    expect(orderDetailsTotalPrice).toHaveTextContent(mockOrderItem.totalPrice.toFixed(2) + "zł");
    expect(orderDetailsClientName).toHaveTextContent(mockOrderItem.client.firstName + " " + mockOrderItem.client.lastName);
    expect(orderDetailsClientName).toHaveTextContent("Imię i nazwisko");
    expect(orderDetailsClientAddress).toHaveTextContent(mockOrderItem.client.city + ", " + mockOrderItem.client.address);
    expect(orderDetailsClientAddress).toHaveTextContent("Adres zamieszkania");
    expect(orderDetailsClientCompanyName).toHaveTextContent(mockOrderItem.client.companyName);
    expect(orderDetailsClientCompanyName).toHaveTextContent("Nazwa firmy");
    expect(orderDetailsClientEmail).toHaveTextContent(mockOrderItem.client.email);
    expect(orderDetailsClientEmail).toHaveTextContent("Adres e-mail");
    expect(orderDetailsClientPhone).toHaveTextContent(mockOrderItem.client.phoneNumber);
    expect(orderDetailsClientPhone).toHaveTextContent("Numer telefonu");
    expect(orderDetailsClientNip).toHaveTextContent(mockOrderItem.client.nip);
    expect(orderDetailsClientNip).toHaveTextContent("NIP");
  });


  test("For not correct param should display not found", async () => {
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "token=test-token"
    });

    render(
      <MemoryRouter initialEntries={["/orders/120"]}>
        <Routes>
          <Route path="orders/:id" element={<OrderDetails />} />
        </Routes>
      </MemoryRouter>
    );

    const orderDetailsContainer = await screen.findByRole("order-details-container");
    const orderDetailsNotFound = await screen.findByRole("order-details-not-found");

    expect(orderDetailsContainer).not.toBeInTheDocument();
    expect(orderDetailsNotFound).toBeInTheDocument();
    expect(orderDetailsNotFound).toHaveTextContent("Nie udało się znaleźć zamówienia o wprowadzonych parametrach");
    expect(orderDetailsNotFound).toHaveTextContent("Powrót na stronę główną");
  });

  
  test("For not correct param link should redirect to main page", async () => {
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "token=test-token"
    });

    render(
      <MemoryRouter initialEntries={["/orders/120"]}>
        <Routes>
          <Route path="orders/:id" element={<OrderDetails />} />
        </Routes>
      </MemoryRouter>
    );

    const orderDetailsNotFoundLink = await screen.findByRole("order-details-not-found-link");

    fireEvent.click(orderDetailsNotFoundLink);

    expect(mockedNavigate).toHaveBeenCalledWith('/');
  });

  
  test("For not provided token page shoud redirect to main page", async () => {
    render(
      <MemoryRouter initialEntries={["/orders/120"]}>
        <Routes>
          <Route path="orders/:id" element={<OrderDetails />} />
        </Routes>
      </MemoryRouter>
    );


    expect(mockedNavigate).toHaveBeenCalledWith('/sign-in');
  });
});