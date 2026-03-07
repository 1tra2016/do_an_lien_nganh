package do_an_lien_nganh.laptop.sales.website.exception;

import do_an_lien_nganh.laptop.sales.website.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException .class)
    public ResponseEntity<ApiResponse<Void>> handleNotFound(ResourceNotFoundException  ex){

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(RuntimeException .class)
    public ResponseEntity<ApiResponse<Void>> handleNotFound(RuntimeException  ex){

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(Exception .class)
    public ResponseEntity<ApiResponse<Void>> handleNotFound(Exception  ex){

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(ex.getMessage()));
    }

}