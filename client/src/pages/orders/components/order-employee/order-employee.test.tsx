import { grey, red } from "@mui/material/colors";
import { act, fireEvent, render, screen } from "@testing-library/react";
import axios from "axios";
import { UserRoleUtils } from "utils/user-role-utils";
import { mockUserList } from "__mocks__/admin";
import { OrderEmployee } from "./order-employee";

jest.mock("axios");

const onChangeAssignment = jest.fn();

let mockAxios = axios as jest.Mocked<typeof axios>;


describe("OrderEmployeeTest", () => {

  beforeEach(() => {
    document.body.innerHTML = "";
    mockAxios.get.mockImplementation(url => {
      switch(url) {
        case "/api/admin/users":
          return Promise.resolve({ data: mockUserList });
        default:
          return Promise.reject(new Error("Unexpected"));
      }
    });
  });

  afterEach(() => {
    mockAxios.get.mockClear();
  })




  test("Component should be rendered correctly", () => {
    render(<OrderEmployee onChangeAssignment={onChangeAssignment} client={mockUserList[0]} />);
    const wrapper = screen.getByRole("order-employee-widget");

    expect(wrapper).toBeInTheDocument();
  });

  test("For empty employee should render unassigned employee", async () => {
    render(<OrderEmployee onChangeAssignment={onChangeAssignment} client={mockUserList[0]} />);

    const unassignedEmployeeBox = await screen.findByRole("unassigned-employee-box");
    const employeeAvatar = await screen.findByRole("employee-avatar");

    expect(unassignedEmployeeBox).toBeInTheDocument();
    expect(unassignedEmployeeBox).toHaveTextContent("Nieprzypisany");
    expect(employeeAvatar).toHaveTextContent("");
    expect(employeeAvatar).toHaveStyle({ marginLeft: '10px', backgroundColor: grey[500] });
  });

  test("For non-empty employee should render widget with employee data", async () => {
    render(<OrderEmployee onChangeAssignment={onChangeAssignment} employee={mockUserList[0]} client={mockUserList[0]} />);
    
    const employeeDataBox = await screen.findByRole("employee-data-box");
    const employeeAvatar = await screen.findByRole("employee-avatar");

    expect(employeeDataBox).toBeInTheDocument();
    expect(employeeDataBox).toHaveTextContent(mockUserList[0].firstName + " " + mockUserList[0].lastName);
    expect(employeeAvatar).toHaveTextContent(mockUserList[0].firstName[0]);
    expect(employeeAvatar).toHaveStyle({ marginLeft: '10px', backgroundColor: red[500] });
  });


  test("For client menu should not be displayed", async () => {
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: `token=test-token; role=["Client"]`
    });
    render(<OrderEmployee onChangeAssignment={onChangeAssignment} client={mockUserList[0]} />);

    const unassignedEmployeeBox = await screen.findByRole("unassigned-employee-box");
    expect(unassignedEmployeeBox).toBeInTheDocument();

    fireEvent.click(unassignedEmployeeBox);

    const orderEmployeeMenu = await screen.queryByRole("order-employee-menu");
    expect(orderEmployeeMenu).not.toBeInTheDocument();
  });


  test("For worker menu should show only one item", async () => {
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: `token=test-token; role=["Client", "Worker"]`
    });

    render(<OrderEmployee onChangeAssignment={onChangeAssignment} client={mockUserList[0]} />);

    const unassignedEmployeeBox = await screen.findByRole("unassigned-employee-box");
    expect(unassignedEmployeeBox).toBeInTheDocument();

    fireEvent.click(unassignedEmployeeBox);

    const orderEmployeeMenu = await screen.queryByRole("order-employee-menu");
    const employeeAssignToMeMenuItem = await screen.queryByRole("employee-assign-to-me-menu-item");
    const employeeAssignToEmployeeMenuItem = await screen.queryByRole("employee-assign-to-employee-menu-item");
    
    expect(orderEmployeeMenu).not.toBeInTheDocument();
    expect(employeeAssignToMeMenuItem).toBeInTheDocument();
    expect(employeeAssignToMeMenuItem).toHaveTextContent("Przypisz do mnie");
    expect(employeeAssignToEmployeeMenuItem).not.toBeInTheDocument();
  });


  test("For admin menu should display two items", async () => {
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: `token=test-token; role=["Client", "Worker", "Admin"]`
    });

    render(<OrderEmployee onChangeAssignment={onChangeAssignment} client={mockUserList[0]} />);

    const unassignedEmployeeBox = await screen.findByRole("unassigned-employee-box");
    expect(unassignedEmployeeBox).toBeInTheDocument();

    fireEvent.click(unassignedEmployeeBox);

    const orderEmployeeMenu = await screen.queryByRole("order-employee-menu");
    const employeeAssignToMeMenuItem = await screen.queryByRole("employee-assign-to-me-menu-item");
    const employeeAssignToEmployeeMenuItem = await screen.queryByRole("employee-assign-to-employee-menu-item");

    expect(orderEmployeeMenu).not.toBeInTheDocument();
    expect(employeeAssignToMeMenuItem).toBeInTheDocument();
    expect(employeeAssignToMeMenuItem).toHaveTextContent("Przypisz do mnie");
    expect(employeeAssignToEmployeeMenuItem).toBeInTheDocument();
    expect(employeeAssignToEmployeeMenuItem).toHaveTextContent("Przypisz do pracownika");
  });


  test("When worker is logged in, worker is owner and employee is unassigned, menu should not be displayed", async () => {
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: `token=test-token; role=["Client", "Worker"]; id=${mockUserList[0].id}`
    });

    render(<OrderEmployee onChangeAssignment={onChangeAssignment} client={mockUserList[0]} />);

    const unassignedEmployeeBox = await screen.findByRole("unassigned-employee-box");
    expect(unassignedEmployeeBox).toBeInTheDocument();

    fireEvent.click(unassignedEmployeeBox);

    const orderEmployeeMenu = await screen.queryByRole("order-employee-menu");
    expect(orderEmployeeMenu).not.toBeInTheDocument();
  });


  test("When admin is logged in, admin is owner and employee is unassigned, menu should not be displayed", async () => {
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: `token=test-token; role=["Client", "Worker", "Admin"]; id=${mockUserList[0].id}`
    });

    render(<OrderEmployee onChangeAssignment={onChangeAssignment} client={mockUserList[0]} />);

    const unassignedEmployeeBox = await screen.findByRole("unassigned-employee-box");
    expect(unassignedEmployeeBox).toBeInTheDocument();

    fireEvent.click(unassignedEmployeeBox);

    const orderEmployeeMenu = await screen.queryByRole("order-employee-menu");
    expect(orderEmployeeMenu).not.toBeInTheDocument();
  });


  test("After clicking first item in menu, it should assign order to signed employee", async () => {
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: `token=test-token; role=["Client", "Worker"]`
    });

    render(<OrderEmployee onChangeAssignment={onChangeAssignment} client={mockUserList[0]} />);

    const unassignedEmployeeBox = await screen.findByRole("unassigned-employee-box");
    expect(unassignedEmployeeBox).toBeInTheDocument();

    fireEvent.click(unassignedEmployeeBox);
    
    const employeeAssignToMeMenuItem = await screen.findByRole("employee-assign-to-me-menu-item");

    fireEvent.click(employeeAssignToMeMenuItem);
    expect(onChangeAssignment).toHaveBeenCalledTimes(1);
  });


  test("After clicking second item, it should open dialog with employee list", async () => {
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: `token=test-token; role=["Client", "Worker", "Admin"]`
    });

    render(<OrderEmployee onChangeAssignment={onChangeAssignment} client={mockUserList[0]} />);

    fireEvent.click(await screen.findByRole("unassigned-employee-box")!);
    await act(async () => Promise.resolve(fireEvent.click(await screen.queryByRole("employee-assign-to-employee-menu-item")!)));

    const employeeAssignToEmployeeDialog = await screen.findByRole("employee-assign-to-employee-dialog");
    const employeeAssignToEmployeeListItems = await screen.findAllByRole("employee-assign-to-employee-list-item");
    const filteredUsers = mockUserList.filter(x => x.id != mockUserList[0]?.id && (UserRoleUtils.isWorker(x.roles) || UserRoleUtils.isAdmin(x.roles)));

    expect(employeeAssignToEmployeeDialog).toBeInTheDocument();
    expect(employeeAssignToEmployeeListItems.length).toEqual(1);
    
    for (let i = 0; i < employeeAssignToEmployeeListItems.length; i++) {
      expect(employeeAssignToEmployeeListItems[i]).toHaveTextContent(filteredUsers[i].firstName + " " + filteredUsers[i].lastName);
    }
  });


  test("After clicking item in employee list dialog, it should assign employee", async () => {
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: `token=test-token; role=["Client", "Worker", "Admin"]`
    });

    const { rerender } = render(<OrderEmployee onChangeAssignment={onChangeAssignment} client={mockUserList[0]} />);

    fireEvent.click(await screen.findByRole("unassigned-employee-box")!);
    await act(async () => Promise.resolve(fireEvent.click(await screen.queryByRole("employee-assign-to-employee-menu-item")!)));

    const employeeAssignToEmployeeListItems = await screen.findAllByRole("employee-assign-to-employee-list-item");
    const filteredUsers = mockUserList.filter(x => x.id != mockUserList[0]?.id && (UserRoleUtils.isWorker(x.roles) || UserRoleUtils.isAdmin(x.roles)));

    await act(() => Promise.resolve(fireEvent.click(employeeAssignToEmployeeListItems[0])));
    expect(onChangeAssignment).toHaveBeenCalledTimes(1);

    rerender(<OrderEmployee onChangeAssignment={onChangeAssignment} client={mockUserList[0]} employee={filteredUsers[0]} />);

    const employeeAssignToEmployeeDialog = await screen.queryByRole("employee-assign-to-employee-dialog");
    const employeeDataBox = await screen.findByRole("employee-data-box");

    expect(employeeAssignToEmployeeDialog).not.toBeInTheDocument();
    expect(employeeDataBox).toBeInTheDocument();
    expect(employeeDataBox).toHaveTextContent(filteredUsers[0].firstName + " " + filteredUsers[0].lastName);
  });
});