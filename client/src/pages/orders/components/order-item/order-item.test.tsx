import { fireEvent, render, screen } from "@testing-library/react";
import moment from "moment";
import "moment/locale/pl";
import { BrowserRouter } from "react-router-dom";
import { OrderUtils } from "utils/order-utils";
import { mockOrderItem } from "__mocks__/order";
import { OrderItem } from "./order-item";

const mockedNavigate = jest.fn();
const onChangeAssignment = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate
}));





describe("OrderItemTest", () => {

  beforeEach(() => {
    document.body.innerHTML = "";

    if (mockedNavigate) {
      mockedNavigate.mockClear();
    }

    render(
      <BrowserRouter>
        <OrderItem order={mockOrderItem} onChangeAssignment={onChangeAssignment} />
      </BrowserRouter>
    )
  });

  test("should render component correctly", async () => {
    const colors = OrderUtils.getOrderStatusColor(mockOrderItem.orderStatus.description);

    const orderItem = await screen.findByRole("order-item");
    const orderItemStatus = await screen.findByRole("order-item-status");
    const orderItemPrice = await screen.findByRole("order-item-price");
    const orderItemPersonDetails = await screen.findByRole("order-item-person-details");
    const orderItemServiceDate = await screen.findByRole("order-item-service-date");
    const orderItemArea = await screen.findByRole("order-item-area");

    expect(orderItem).toBeInTheDocument();
    expect(orderItemStatus).toHaveStyle({
      backgroundColor: colors.background,
      color: colors.color
    });
    expect(orderItemStatus).toHaveTextContent("NEW");
    expect(orderItemPrice).toHaveTextContent(mockOrderItem.totalPrice.toFixed(2) + "zł");
    expect(orderItemPersonDetails).toHaveTextContent(mockOrderItem.client.firstName + " " + mockOrderItem.client.lastName);
    expect(orderItemServiceDate).toHaveTextContent(moment(mockOrderItem.serviceDate).locale("pl").format("DD MMMM yyyy"));
    expect(orderItemArea).toHaveTextContent(mockOrderItem.area + "m2");
    
  });

  test("After clicking details button it should route to details page", async () => {
    const orderItemDetailsButton = await screen.findByRole("order-item-details-button");

    fireEvent.click(orderItemDetailsButton);

    expect(mockedNavigate).toHaveBeenCalledWith('/orders/' + mockOrderItem.orderId);
  });
});