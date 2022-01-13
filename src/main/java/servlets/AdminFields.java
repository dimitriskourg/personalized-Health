
package servlets;

        import database.tables.EditDoctorTable;
        import database.tables.EditSimpleUserTable;
        import mainClasses.Doctor;
        import mainClasses.SimpleUser;
        import org.json.JSONArray;
        import org.json.JSONObject;

        import javax.servlet.*;
        import javax.servlet.http.*;
        import javax.servlet.annotation.*;
        import java.io.IOException;
        import java.io.PrintWriter;
        import java.sql.SQLException;
        import java.util.Objects;


@WebServlet(name = "AdminFields", value = "/AdminFields")
public class AdminFields extends HttpServlet {



    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        PrintWriter out1 = response.getWriter();
        JSONArray doctor_array = new JSONArray();
        JSONArray user_array = new JSONArray();
        EditDoctorTable doctorTable = new EditDoctorTable();
        EditSimpleUserTable userTable = new EditSimpleUserTable();
        try {

            for (Doctor doc:doctorTable.databaseToDoctors()) {

                JSONObject copy_of_doctor = new JSONObject(doc);

                copy_of_doctor.remove("password");
                doctor_array.put(copy_of_doctor);
            }



            for (SimpleUser user:userTable.databaseToUsers()){
                if(Objects.equals(user.getUsername(), "admin")){
                    continue;
                }
                JSONObject copy_of_user = new JSONObject(user);
                copy_of_user.remove("password");
                user_array.put(copy_of_user);
            }

            String ret = "{\"doctors\":" + doctor_array.toString() +",\"users\":"+ user_array.toString()+ "}";

            System.out.println(ret);
            response.setStatus(200);
            out1.println(ret);
        } catch (SQLException | ClassNotFoundException throwables) {
            throwables.printStackTrace();
            response.setStatus(401);
        }
    }


}