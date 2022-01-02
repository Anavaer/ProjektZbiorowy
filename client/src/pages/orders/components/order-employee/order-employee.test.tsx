import { grey, red } from "@mui/material/colors";
import { fireEvent, render, screen } from "@testing-library/react";
import { User } from "types";
import { OrderEmployee } from "./order-employee";


const onChangeAssignment = jest.fn();

let person: User ={
  "id": 1,
  "companyName": "Moja firma",
  "nip": "123213",
  "firstName": "Client",
  "lastName": "Clientowski",
  "city": "Radom",
  "address": "ul. Sienkiewicza 3",
  "phoneNumber": "",
  "email": ""
};


describe("OrderEmployeeTest", () => {

  beforeEach(() => {
    document.body.innerHTML = "";
  })

  test("Component should be rendered correctly", () => {
    render(<OrderEmployee onChangeAssignment={onChangeAssignment} />);
    const wrapper = screen.getByRole("order-employee-widget");

    expect(wrapper).toBeInTheDocument();
  });

  test("For empty employee should render unassigned employee", async () => {
    render(<OrderEmployee onChangeAssignment={onChangeAssignment} />);

    const unassignedEmployeeBox = await screen.findByRole("unassigned-employee-box");
    const employeeAvatar = await screen.findByRole("employee-avatar");

    expect(unassignedEmployeeBox).toBeInTheDocument();
    expect(unassignedEmployeeBox).toHaveTextContent("Nieprzypisany");
    expect(employeeAvatar).toHaveTextContent("");
    expect(employeeAvatar).toHaveStyle({ marginLeft: '10px', backgroundColor: grey[500] });
  });

  test("For non-empty employee should render widget with employee data", async () => {
    render(<OrderEmployee onChangeAssignment={onChangeAssignment} employee={person} client={person} />);
    
    const employeeDataBox = await screen.findByRole("employee-data-box");
    const employeeAvatar = await screen.findByRole("employee-avatar");

    expect(employeeDataBox).toBeInTheDocument();
    expect(employeeDataBox).toHaveTextContent(person.firstName + " " + person.lastName);
    expect(employeeAvatar).toHaveTextContent(person.firstName[0]);
    expect(employeeAvatar).toHaveStyle({ marginLeft: '10px', backgroundColor: red[500] });
  });


  test("For empty employee should show menu", async () => {
    render(<OrderEmployee onChangeAssignment={onChangeAssignment} />);

    const unassignedEmployeeBox = await screen.findByRole("unassigned-employee-box");
    expect(unassignedEmployeeBox).toBeInTheDocument();

    fireEvent.click(unassignedEmployeeBox);

    const employeeAssignToMeMenuItem = await screen.findByRole("employee-assign-to-me-menu-item");
    expect(employeeAssignToMeMenuItem).toBeInTheDocument();
    expect(employeeAssignToMeMenuItem).toHaveTextContent("Przypisz do mnie");
  });



  test("For empty employee should assign signed employee", async () => {
    render(<OrderEmployee onChangeAssignment={onChangeAssignment} />);

    const unassignedEmployeeBox = await screen.findByRole("unassigned-employee-box");
    expect(unassignedEmployeeBox).toBeInTheDocument();

    fireEvent.click(unassignedEmployeeBox);
    
    const employeeAssignToMeMenuItem = await screen.findByRole("employee-assign-to-me-menu-item");

    fireEvent.click(employeeAssignToMeMenuItem);
    expect(onChangeAssignment).toHaveBeenCalledTimes(1);
  });
})