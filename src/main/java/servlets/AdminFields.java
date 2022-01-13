
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


@WebServlet(name = "AdminFields", value = "/AdminFields")
public class AdminFields extends HttpServlet {



    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        PrintWriter out1 = response.getWriter();
        JSONArray ja = new JSONArray();
        EditDoctorTable dt = new EditDoctorTable();
        EditSimpleUserTable sut = new EditSimpleUserTable();
        try {

            for (Doctor doc:dt.databaseToDoctors()) {

                JSONObject jo = new JSONObject(doc);
                jo.remove("password");
                ja.put(jo);
            }

            ja.put("end_of_doctors");

            for (SimpleUser user:sut.databaseToUsers()){

                JSONObject jo = new JSONObject(user);
                jo.remove("password");
                ja.put(jo);
            }
            System.out.println(ja.toString());
            response.setStatus(200);
            out1.println(ja.toString());
        } catch (SQLException | ClassNotFoundException throwables) {
            throwables.printStackTrace();
            response.setStatus(403);
        }
    }


}