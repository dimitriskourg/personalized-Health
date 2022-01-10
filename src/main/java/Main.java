import database.init.InitDatabase;

import java.sql.SQLException;
import database.tables.* ;

public class Main {
    public static void main(String[] args) throws SQLException, ClassNotFoundException {
        InitDatabase init = new InitDatabase();
        init.initDatabase();
        init.initTables();
        init.addToDatabaseExamples();
        // init.updateRecords();
        init.databaseToJSON();

        // init.deleteRecords();
    }

}
