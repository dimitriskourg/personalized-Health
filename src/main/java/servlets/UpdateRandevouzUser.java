package servlets;

import database.tables.EditRandevouzTable;
import database.tables.EditSimpleUserTable;
import mainClasses.JSON_Converter;
import org.json.JSONObject;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.Objects;

@WebServlet(name = "UpdateRandevouzUser", value = "/UpdateRandevouzUser")
public class UpdateRandevouzUser extends HttpServlet {


    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        PrintWriter out1 = response.getWriter();
        JSONObject ret = new JSONObject();
        JSON_Converter converter = new JSON_Converter();
        JSONObject jo = new JSONObject(converter.getJSONFromAjax(request.getReader()));
        EditRandevouzTable randevouzTable = new EditRandevouzTable();

        HttpSession session = request.getSession();
        EditSimpleUserTable table = new EditSimpleUserTable();

        int id = jo.getInt("id");
        String action = "selected";
        String user_info = jo.getString("user_info");

        try {
            if (randevouzTable.databaseToRandevouz(id)==null){
                ret.put("error","no such randevouz id exists");
                response.setStatus(404);
            }else if (randevouzTable.databaseToRandevouz(id).getUser_id()==0 && Objects.equals(action, "done")){
                ret.put("error","no user in the this randevouz to be completed");
                response.setStatus(403);
            }else{
                randevouzTable.updateRandevouz(id,action,user_info,table.databaseToSimpleUser(session.getAttribute("username").toString()).getUser_id());
                ret.put("success","randevouz updated");
                response.setStatus(200);
            }

        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            ret.put("error","unexpected error in sql base");
            response.setStatus(403);
        }
        System.out.println(ret);
        out1.println(ret);
    }
}
